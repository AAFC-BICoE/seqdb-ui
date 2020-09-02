import {
  ApiClientContext,
  DeleteButton,
  ErrorViewer,
  safeSubmit,
  SubmitButton,
  TextField,
  useModal
} from "common-ui";
import { Form, Formik } from "formik";
import { useContext } from "react";
import { DinaMessage } from "../../intl/dina-ui-intl";
import { Person } from "../../types/objectstore-api";

interface PersonFormProps {
  person?: Person;
  onSubmitSuccess: () => Promise<void>;
}

/** Form to add or edit a Person. */
export function PersonForm({ onSubmitSuccess, person }: PersonFormProps) {
  const { save } = useContext(ApiClientContext);

  const initialValues = person || { type: "person" };

  const id = person?.id;

  const onSubmit = safeSubmit(async submittedValues => {
    await save(
      [
        {
          resource: submittedValues,
          type: "person"
        }
      ],
      {
        apiBaseUrl: "/agent-api"
      }
    );

    await onSubmitSuccess();
  });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form translate={undefined}>
        <ErrorViewer />
        <div>
          <div style={{ maxWidth: "20rem" }}>
            <TextField name="displayName" />
          </div>
          <div style={{ maxWidth: "20rem" }}>
            <TextField name="email" />
          </div>
          <div className="form-group">
            <SubmitButton />
            <DeleteButton
              id={id}
              options={{ apiBaseUrl: "/agent-api" }}
              postDeleteRedirect="/person/list"
              type="person"
            />
          </div>
        </div>
      </Form>
    </Formik>
  );
}

/** Button that opens a PersonForm in a modal. */
export function AddPersonButton() {
  const { closeModal, openModal } = useModal();

  async function onSubmitSuccess() {
    closeModal();
  }

  return (
    <button
      className="btn btn-info delete-button open-person-modal"
      onClick={() =>
        openModal(
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                <DinaMessage id="addPersonTitle" />
              </h2>
            </div>
            <div className="modal-body">
              <PersonForm onSubmitSuccess={onSubmitSuccess} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-dark" onClick={closeModal}>
                <DinaMessage id="cancelButtonText" />
              </button>
            </div>
          </div>
        )
      }
      type="button"
    >
      <DinaMessage id="addPersonButtonText" />
    </button>
  );
}