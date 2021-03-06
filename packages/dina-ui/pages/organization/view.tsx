import {
  ButtonBar,
  BackButton,
  DinaForm,
  EditButton,
  FieldView,
  LoadingSpinner,
  Query
} from "common-ui";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import { Footer, Head, Nav } from "../../components";
import { DinaMessage, useDinaIntl } from "../../intl/dina-ui-intl";
import { Organization } from "../../types/agent-api/resources/Organization";

export function OrganizationDetailsPage({ router }: WithRouterProps) {
  const { id } = router.query;
  const { formatMessage } = useDinaIntl();

  return (
    <div>
      <Head title={formatMessage("organizationViewTitle")} />
      <Nav />
      <ButtonBar>
        <EditButton entityId={id as string} entityLink="organization" />
        <BackButton
          entityId={id as string}
          entityLink="/organization"
          byPassView={true}
        />
      </ButtonBar>
      <Query<Organization> query={{ path: `agent-api/organization/${id}` }}>
        {({ loading, response }) => {
          const organization = response && {
            ...response.data
          };

          if (organization && organization.createdOn) {
            const inUserTimeZone = new Date(organization.createdOn).toString();
            organization.createdOn = inUserTimeZone;
          }

          if (organization) {
            organization.name = new Map();
            organization.name[organization.names[0].languageCode] =
              organization.names[0].name;
            organization.name[organization.names[1]?.languageCode] =
              organization.names[1]?.name;
          }
          return (
            <main className="container-fluid">
              <h1>
                <DinaMessage id="organizationViewTitle" />
              </h1>
              <LoadingSpinner loading={loading} />
              {organization && (
                <DinaForm<Organization> initialValues={organization}>
                  <div className="row">
                    <FieldView
                      className="col-md-2"
                      name="name.EN"
                      label={formatMessage("organizationEnglishNameLabel")}
                    />
                    <FieldView
                      className="col-md-2"
                      name="name.FR"
                      label={formatMessage("organizationFrenchNameLabel")}
                    />
                    <FieldView className="col-md-3" name="aliases" />
                    <FieldView className="col-md-2" name="createdBy" />
                    <FieldView className="col-md-2" name="createdOn" />
                  </div>
                </DinaForm>
              )}
            </main>
          );
        }}
      </Query>
      <Footer />
    </div>
  );
}

export default withRouter(OrganizationDetailsPage);
