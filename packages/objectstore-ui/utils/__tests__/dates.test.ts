import { readableDate } from "../dates";

// Locale can be different per machine running this, so mock the locale string:
const MOCK_LOCALE_STRING = "2/27/2020, 4:46:05 PM";
jest
  .spyOn(Date.prototype, "toLocaleString")
  .mockReturnValue(MOCK_LOCALE_STRING);

describe("Dates utils", () => {
  it("Shows a readable date string from ISO format.", () => {
    expect(readableDate("2020-02-27T21:46:05.654Z")).toEqual(
      "2/27/2020, 4:46:05 PM"
    );
  });

  it("Shows a blank date as a blank string.", () => {
    expect(readableDate("")).toEqual("");
  });
});
