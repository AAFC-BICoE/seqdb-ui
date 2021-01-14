import "bootstrap/dist/css/bootstrap.min.css";
import {
  AuthenticatedApiClientProvider,
  createContextValue,
  KeycloakAccountProvider,
  ModalProvider
} from "common-ui";
import "common-ui/lib/button-bar/buttonbar.css";
import "handsontable/dist/handsontable.full.min.css";
import App from "next/app";
import "rc-tooltip/assets/bootstrap.css";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-dropzone-uploader/dist/styles.css";
import "react-table/react-table.css";
import "react-tabs/style/react-tabs.css";
import "../components/button-bar/nav/app-top.css";
import "../components/button-bar/nav/nav.css";
import "../components/button-bar/nav/wet-beow-bootstrap-4.css";
import { FileUploadProviderImpl } from "../components/object-store/file-upload/FileUploadProvider";
import { DinaIntlProvider } from "../intl/dina-ui-intl";

/** Get Random UUID */
function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
    const randomNumber = Math.floor(Math.random() * 16);
    // tslint:disable-next-line: no-bitwise
    const v = char === "x" ? randomNumber : (randomNumber & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * App component that wraps every page component.
 *
 * See: https://github.com/zeit/next.js/#custom-app
 */
export default class DinaUiApp extends App {
  private contextValue = createContextValue({
    baseURL: "/api",
    getTempIdGenerator: () => uuidv4
  });

  public render() {
    const { Component, pageProps } = this.props;

    const appElement = process.browser
      ? document.querySelector<HTMLElement>("#__next")
      : null;

    return (
      <KeycloakAccountProvider>
        <AuthenticatedApiClientProvider apiContext={this.contextValue}>
          <FileUploadProviderImpl>
            <DinaIntlProvider>
              <ModalProvider appElement={appElement}>
                <Component {...pageProps} />
              </ModalProvider>
            </DinaIntlProvider>
          </FileUploadProviderImpl>
        </AuthenticatedApiClientProvider>
      </KeycloakAccountProvider>
    );
  }
}
