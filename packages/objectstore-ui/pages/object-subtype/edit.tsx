import {
  ApiClientContext,
  ButtonBar,
  CancelButton,
  DeleteButton,
  ErrorViewer,
  LoadingSpinner,
  Query,
  safeSubmit,
  SelectField,
  SubmitButton,
  TextField
} from "common-ui";
import { Form, Formik } from "formik";
import { WithRouterProps } from "next/dist/client/with-router";
import { NextRouter, withRouter } from "next/router";
import { useContext } from "react";
import { ObjectSubtype } from "types/objectstore-api/resources/ObjectSubtype";
import { Head, Nav } from "../../components";
import {
  ObjectStoreMessage,
  useObjectStoreIntl
} from "../../intl/objectstore-intl";

interface ObjectSubtypeFormProps {
  objectSubtype?: ObjectSubtype;
  router: NextRouter;
}

export function ObjectSubtypeEditPage({ router }: WithRouterProps) {
  const { id } = router.query;
  const { formatMessage } = useObjectStoreIntl();

  return (
    <div>
      <Head title={formatMessage("editObjectSubtypeTitle")} />
      <Nav />
      <div className="container-fluid">
        {id ? (
          <div>
            <h1>
              <ObjectStoreMessage id="editObjectSubtypeTitle" />
            </h1>
            <Query<ObjectSubtype> query={{ path: `object-subtype/${id}` }}>
              {({ loading, response }) => (
                <div>
                  <LoadingSpinner loading={loading} />
                  {response && (
                    <ObjectSubtypeForm
                      objectSubtype={response.data}
                      router={router}
                    />
                  )}
                </div>
              )}
            </Query>
          </div>
        ) : (
          <div>
            <h1>
              <ObjectStoreMessage id="addObjectSubtypeTitle" />
            </h1>
            <ObjectSubtypeForm router={router} />
          </div>
        )}
      </div>
    </div>
  );
}

function ObjectSubtypeForm({ objectSubtype, router }: ObjectSubtypeFormProps) {
  const { save } = useContext(ApiClientContext);
  const { id } = router.query;
  const initialValues = objectSubtype || { type: "object-subtype" };

  const onSubmit = safeSubmit(async submittedValues => {
    await save([
      {
        resource: submittedValues,
        type: "object-subtype"
      }
    ]);

    await router.push(`/object-subtype/list`);
  });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <ErrorViewer />
        <ButtonBar>
          <SubmitButton />
          <DeleteButton
            id={id as string}
            postDeleteRedirect="/object-subtype/list"
            type="object-subtype"
          />
          <CancelButton
            entityId={id as string}
            entityLink="object-subtype"
            byPassView={true}
          />
        </ButtonBar>
        <div>
          <div className="row">
            <SelectField
              options={DC_TYPE_OPTIONS}
              name="dcType"
              className="col-sm-4"
            />
          </div>
          <div className="row">
            <TextField className="col-md-4" name="acSubtype" />
          </div>
        </div>
      </Form>
    </Formik>
  );
}

const DC_TYPE_OPTIONS = [
  {
    label: "Image",
    value: "IMAGE"
  },
  {
    label: "Moving Image",
    value: "MOVING_IMAGE"
  },
  {
    label: "Sound",
    value: "SOUND"
  },
  {
    label: "Text",
    value: "TEXT"
  },
  {
    label: "Dataset",
    value: "DATASET"
  },
  {
    label: "Undetermined",
    value: "UNDETERMINED"
  }
];

export default withRouter(ObjectSubtypeEditPage);