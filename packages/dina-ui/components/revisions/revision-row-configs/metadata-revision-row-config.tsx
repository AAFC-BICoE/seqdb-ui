import { DateView } from "common-ui";
import Link from "next/link";
import { Metadata, Person } from "../../../types/objectstore-api";
import { MetadataManagedAttributes } from "../../object-store";
import { ReferenceLink } from "../ReferenceLink";
import { RevisionRowConfig } from "../revision-row-config";

export const METADATA_REVISION_ROW_CONFIG: RevisionRowConfig<Metadata> = {
  name: ({ id, originalFilename }) => (
    <Link href={`/object-store/object/view?id=${id}`}>
      <a>{originalFilename}</a>
    </Link>
  ),
  customValueCells: {
    // Date Fields:
    createdDate: ({ original: { value } }) => <DateView date={value} />,
    xmpMetadataDate: ({ original: { value } }) => <DateView date={value} />,
    acDigitizationDate: ({ original: { value } }) => <DateView date={value} />,
    // Link to the original metadata:
    acDerivedFrom: ({ original: { value: instanceId } }) => {
      return (
        <ReferenceLink<Metadata>
          baseApiPath="objectstore-api"
          instanceId={instanceId}
          link={({ id, originalFilename }) => (
            <Link href={`/object-store/object/view?id=${id}`}>
              <a>{originalFilename}</a>
            </Link>
          )}
        />
      );
    },
    // Link to the Metadata creator:
    acMetadataCreator: ({ original: { value: relation } }) => {
      return (
        relation && (
          <ReferenceLink<Person>
            baseApiPath="agent-api"
            instanceId={{ typeName: "person", cdoId: relation.id }}
            link={({ displayName }) => <span>{displayName}</span>}
          />
        )
      );
    },
    // Link to the doc creator:
    dcCreator: ({ original: { value: relation } }) => {
      return (
        relation && (
          <ReferenceLink<Person>
            baseApiPath="agent-api"
            instanceId={{ typeName: "person", cdoId: relation.id }}
            link={({ displayName }) => <span>{displayName}</span>}
          />
        )
      );
    },
    // Show the entire value of the metadata map in a key-value table:
    managedAttributeMap: ({ original: { value } }) => (
      <MetadataManagedAttributes managedAttributeMap={value} />
    )
  }
};
