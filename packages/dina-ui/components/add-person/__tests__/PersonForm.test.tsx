import { AddPersonButton, PersonForm } from "../PersonForm";
import { mountWithAppContext } from "../../../test-util/mock-app-context";
import { Person } from "../../../types/objectstore-api";

const mockSave = jest.fn();

const TEST_PERSON_WITH_ALIASES: Person = {
  type: "person",
  displayName: "test-person",
  email: "a@b.com",
  uuid: "11111",
  aliases: ["alias1", "alias2", "alias3"]
};

describe("PersonForm", () => {
  it("AddPersonButton opens the PersonForm modal", async () => {
    const wrapper = mountWithAppContext(<AddPersonButton />, {
      apiContext: { save: mockSave }
    });

    // Open modal:
    wrapper.find("button.open-person-modal").simulate("click");
    wrapper.update();

    // Modify the displayName value.
    wrapper.find(".displayName-field input").simulate("change", {
      target: { name: "displayName", value: "new test person" }
    });

    // Modify the email value.
    wrapper.find(".email-field input").simulate("change", {
      target: { name: "email", value: "person@example.com" }
    });

    // Submit the form.
    wrapper.find("form").simulate("submit");

    await new Promise(setImmediate);
    wrapper.update();

    await new Promise(setImmediate);

    expect(mockSave).lastCalledWith(
      [
        {
          resource: {
            aliases: [],
            displayName: "new test person",
            email: "person@example.com",
            type: "person"
          },
          type: "person"
        }
      ],
      { apiBaseUrl: "/agent-api" }
    );
  });

  it("Renders the aliases array as a multi-line text input.", async () => {
    const wrapper = mountWithAppContext(
      <PersonForm person={TEST_PERSON_WITH_ALIASES} />
    );

    expect(
      wrapper.find(".aliasesAsLines-field textarea").prop("value")
    ).toEqual(["alias1", "alias2", "alias3", ""].join("\n"));
  });

  it("Submits the aliases as any array.", async () => {
    const wrapper = mountWithAppContext(
      <PersonForm person={TEST_PERSON_WITH_ALIASES} />,
      { apiContext: { save: mockSave } }
    );

    wrapper.find(".aliasesAsLines-field textarea").prop<any>("onChange")({
      target: { value: ["new-alias1", "new-alias2"].join("\n") }
    });
    wrapper.update();

    wrapper.find("form").simulate("submit");

    await new Promise(setImmediate);
    wrapper.update();

    expect(mockSave).lastCalledWith(
      [
        {
          resource: {
            aliases: ["new-alias1", "new-alias2"],
            displayName: "test-person",
            email: "a@b.com",
            type: "person",
            uuid: "11111"
          },
          type: "person"
        }
      ],
      { apiBaseUrl: "/agent-api" }
    );
  });
});
