import { NavbarUserControl } from "../NavBarUserControl";
import { mountWithAppContext } from "../../test-util/mock-app-context";

describe("NavBarUserControl component", () => {
  it("Shows the logout button when logged in.", () => {
    const mockLogout = jest.fn();
    const wrapper = mountWithAppContext(<NavbarUserControl />, {
      accountContext: { authenticated: true, logout: mockLogout }
    });

    const logoutButton = wrapper.find("button.logout-button");

    // Click the logout button:
    logoutButton.simulate("click");
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("Shows neither the login or logout button when the account context is not initialized.", () => {
    const wrapper = mountWithAppContext(<NavbarUserControl />, {
      accountContext: { initialized: false }
    });

    expect(wrapper.find("button.logout-button").exists()).toEqual(false);
  });
});
