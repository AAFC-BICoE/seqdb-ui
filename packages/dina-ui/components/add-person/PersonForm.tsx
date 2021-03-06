import {
  DeleteButton,
  DinaForm,
  DinaFormOnSubmit,
  filterBy,
  SubmitButton,
  TextField,
  useModal
} from "common-ui";
import { ResourceSelectField } from "common-ui/lib";
import { PersistedResource } from "kitsu";
import { Organization } from "packages/dina-ui/types/agent-api/resources/Organization";
import { DinaMessage } from "../../intl/dina-ui-intl";
import { Person } from "../../types/objectstore-api";

interface PersonFormProps {
  person?: Person;
  onSubmitSuccess?: (person: PersistedResource<Person>) => void | Promise<void>;
}

interface PersonFormValues extends Partial<Person> {
  aliasesAsLines?: string;
}

/** Form to add or edit a Person. */
export function PersonForm({ onSubmitSuccess, person }: PersonFormProps) {
  const initialValues: PersonFormValues = person || { type: "person" };

  // Convert acceptedValues to easily editable string format:
  initialValues.aliasesAsLines =
    initialValues.aliases?.concat("")?.join("\n") ?? "";

  const id = person?.id;

  const onSubmit: DinaFormOnSubmit = async ({
    api: { save },
    submittedValues: { aliasesAsLines, ...submittedPerson }
  }) => {
    const submitCopy = { ...submittedPerson };
    if (submitCopy.organizations) {
      submittedPerson.relationships = {};
      submittedPerson.relationships.organizations = {};
      submittedPerson.relationships.organizations.data = [];
      submitCopy.organizations.map(org =>
        submittedPerson.relationships.organizations.data.push({
          id: org.id,
          type: "organization"
        })
      );
      delete submittedPerson.organizations;
    }

    // Convert user-suplied string to string array:
    submittedPerson.aliases =
      (aliasesAsLines || "")
        // Split by line breaks:
        .match(/[^\r\n]+/g)
        // Remove empty lines:
        ?.filter(line => line.trim()) ?? [];

    const [savedPerson] = await save<Person>(
      [
        {
          resource: submittedPerson,
          type: "person"
        }
      ],
      {
        apiBaseUrl: "/agent-api"
      }
    );

    await onSubmitSuccess?.(savedPerson);
  };

  return (
    <DinaForm initialValues={initialValues} onSubmit={onSubmit}>
      <div style={{ width: "30rem" }}>
        <TextField name="displayName" />
      </div>
      <div style={{ width: "30rem" }}>
        <TextField name="givenNames" />
      </div>
      <div style={{ width: "30rem" }}>
        <TextField name="familyNames" />
      </div>
      <div style={{ width: "30rem" }}>
        <TextField name="aliasesAsLines" multiLines={true} />
      </div>
      <div style={{ width: "30rem" }}>
        <TextField name="email" />
      </div>
      <div style={{ width: "30rem" }}>
        <ResourceSelectField<Organization>
          name="organizations"
          filter={filterBy(["names[0].name"])}
          model="agent-api/organization"
          isMulti={true}
          optionLabel={organization => organization.names?.[0].name}
        />
      </div>
      <div className="form-group list-inline">
        <div className="list-inline-item">
          <SubmitButton />
        </div>
        <div className="list-inline-item">
          <DeleteButton
            id={id}
            options={{ apiBaseUrl: "/agent-api" }}
            postDeleteRedirect="/person/list"
            type="person"
          />
        </div>
      </div>
    </DinaForm>
  );
}

/** Button that opens a PersonForm in a modal. */
export function AddPersonButton() {
  const { openAddPersonModal } = useAddPersonModal();

  return (
    <button
      className="btn btn-info delete-button open-person-modal"
      onClick={openAddPersonModal}
      type="button"
    >
      <DinaMessage id="addPersonButtonText" />
    </button>
  );
}

export function useAddPersonModal() {
  const { closeModal, openModal } = useModal();

  function openAddPersonModal() {
    return new Promise<PersistedResource<Person> | undefined>(resolve => {
      function finishModal(newPerson?: PersistedResource<Person>) {
        closeModal();
        resolve(newPerson);
      }

      openModal(
        <div className="modal-content">
          <style>{`.modal-dialog { max-width: 100rem; }`}</style>
          <div className="modal-header">
            <h2>
              <DinaMessage id="addPersonTitle" />
            </h2>
          </div>
          <div className="modal-body">
            <PersonForm onSubmitSuccess={finishModal} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-dark" onClick={() => finishModal()}>
              <DinaMessage id="cancelButtonText" />
            </button>
          </div>
        </div>
      );
    });
  }

  return { openAddPersonModal };
}
