import "bootstrap/dist/css/bootstrap.min.css";
import {
  ApiClientImplProvider,
  AuthenticatedApiClientProvider,
  KeycloakAccountProvider,
  ModalProvider
} from "common-ui";
import "common-ui/lib/button-bar/buttonbar.css";
import "handsontable/dist/handsontable.full.min.css";
import { AppProps } from "next/app";
import "rc-tooltip/assets/bootstrap.css";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-dropzone-uploader/dist/styles.css";
import "react-table/react-table.css";
import "react-tabs/style/react-tabs.css";
import { ErrorBoundaryPage } from "../components";
import "../components/button-bar/nav/app-top.css";
import "../components/button-bar/nav/nav.css";
import "../components/button-bar/nav/wet-beow-bootstrap-4.css";
import "common-ui/lib/table/react-table-style.css";
import { FileUploadProviderImpl } from "../components/object-store/file-upload/FileUploadProvider";
import { DinaIntlProvider } from "../intl/dina-ui-intl";

/**
 * App component that wraps every page component.
 *
 * See: https://github.com/zeit/next.js/#custom-app
 */
export default function DinaUiApp({ Component, pageProps }: AppProps) {
  const appElement = process.browser
    ? document.querySelector<HTMLElement>("#__next")
    : null;

  return (
    <KeycloakAccountProvider>
      <ApiClientImplProvider>
        <AuthenticatedApiClientProvider>
          <FileUploadProviderImpl>
            <DinaIntlProvider>
              <ErrorBoundaryPage>
                <ModalProvider appElement={appElement}>
                  <Component {...pageProps} />
                </ModalProvider>
              </ErrorBoundaryPage>
            </DinaIntlProvider>
          </FileUploadProviderImpl>
        </AuthenticatedApiClientProvider>
      </ApiClientImplProvider>
    </KeycloakAccountProvider>
  );
}
