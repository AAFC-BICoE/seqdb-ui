import {
  ApiClientContext,
  ErrorViewer,
  LoadingSpinner,
  Query,
  safeSubmit,
  SubmitButton,
  TextField
} from "common-ui";
import { Form, Formik } from "formik";
import { WithRouterProps } from "next/dist/client/with-router";
import { NextRouter, withRouter } from "next/router";
import { useContext } from "react";
import { ButtonBar, CancelButton, Head, Nav } from "../../components";
import { Region } from "../../types/seqdb-api/resources/Region";

interface RegionFormProps {
  region?: Region;
  router: NextRouter;
}

export function RegionEditPage({ router }: WithRouterProps) {
  const { id } = router.query;

  return (
    <div>
      <Head title="Edit Gene Region" />
      <Nav />
      <div className="container-fluid">
        {id ? (
          <div>
            <h1>Edit Gene Region</h1>
            <Query<Region> query={{ path: `region/${id}` }}>
              {({ loading, response }) => (
                <div>
                  <LoadingSpinner loading={loading} />
                  {response && (
                    <RegionForm region={response.data} router={router} />
                  )}
                </div>
              )}
            </Query>
          </div>
        ) : (
          <div>
            <h1>Add Gene Region</h1>
            <RegionForm router={router} />
          </div>
        )}
      </div>
    </div>
  );
}

function RegionForm({ region, router }: RegionFormProps) {
  const { save } = useContext(ApiClientContext);
  const { id } = router.query;
  const initialValues = region || {};

  const onSubmit = safeSubmit(async submittedValues => {
    const response = await save([
      {
        resource: submittedValues,
        type: "region"
      }
    ]);

    const newId = response[0].id;
    await router.push(`/region/view?id=${newId}`);
  });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <ErrorViewer />
        <ButtonBar>
          <SubmitButton />
          <CancelButton entityId={id as string} entityLink="region" />
        </ButtonBar>
        <div>
          <div className="row">
            <TextField className="col-md-2" name="name" />
            <TextField className="col-md-2" name="symbol" />
            <TextField className="col-md-2" name="description" />
          </div>
          <SubmitButton />
        </div>
      </Form>
    </Formik>
  );
}

export default withRouter(RegionEditPage);