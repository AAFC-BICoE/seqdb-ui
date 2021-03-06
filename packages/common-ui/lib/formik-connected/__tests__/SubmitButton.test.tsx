import { mountWithAppContext } from "../../test-util/mock-app-context";
import { DinaForm } from "../DinaForm";
import { SubmitButton } from "../SubmitButton";

describe("SubmitButton component", () => {
  it("Shows a submit button when the form is not submitting.", () => {
    const wrapper = mountWithAppContext(
      /* tslint:disable:no-empty */
      <DinaForm initialValues={{}}>
        <SubmitButton />
      </DinaForm>
    );

    expect(wrapper.find(".spinner-border").exists()).toEqual(false);
    expect(wrapper.find("button").exists()).toEqual(true);
  });

  it("Shows a loading spinner when the form is submitting.", () => {
    const wrapper = mountWithAppContext(
      /* tslint:disable:no-empty */
      <DinaForm initialValues={{}}>
        <SubmitButton />
      </DinaForm>
    );

    wrapper.find("form").simulate("submit");

    expect(wrapper.find(".spinner-border").exists()).toEqual(true);
    expect(wrapper.find("button").exists()).toEqual(false);
  });
});
