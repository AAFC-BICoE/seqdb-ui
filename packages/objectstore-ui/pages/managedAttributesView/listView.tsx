import { ColumnDefinition, ListPageLayout } from "common-ui";
import Link from "next/link";
import { Head, Nav } from "../../components";
import { ObjectStoreMessage } from "../../intl/objectstore-intl";
import { ManagedAttribute } from "../../types/objectstore-api/resources/ManagedAttribute";

const ATTRIBUTES_LIST_COLUMNS: Array<ColumnDefinition<ManagedAttribute>> = [
  {
    Cell: ({ original: { id, name } }) => (
      <Link href={`/managedAttributesView/detailsView?id=${id}`}>
        <a>{name}</a>
      </Link>
    ),
    Header: "Name",
    accessor: "name"
  },
  "managedAttributeType",
  {
    Cell: ({ original: { acceptedValues } }) => (
      <div>{acceptedValues?.join(", ")}</div>
    ),
    accessor: "acceptedValues"
  }
];

const ATTRIBUTES_FILTER_ATTRIBUTES = ["name"];

export default function ManagedAttributesListPage() {
  return (
    <div>
      <Head title="Managed Attributes" />
      <Nav />
      <div className="container-fluid">
        <h1>
          <ObjectStoreMessage id="managedAttributeListTitle" />
        </h1>
        <Link href="/managedAttributesView/detailsView">
          <a className="btn btn-primary">
            <ObjectStoreMessage id="addManagedAttributeButtonText" />
          </a>
        </Link>
        <ListPageLayout
          filterAttributes={ATTRIBUTES_FILTER_ATTRIBUTES}
          id="managed-attribute-list"
          queryTableProps={{
            columns: ATTRIBUTES_LIST_COLUMNS,
            path: "managed-attribute"
          }}
        />
      </div>
    </div>
  );
}