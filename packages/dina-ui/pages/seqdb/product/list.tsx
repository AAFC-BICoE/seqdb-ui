import {
  ButtonBar,
  ColumnDefinition,
  CreateButton,
  ListPageLayout
} from "common-ui";
import Link from "next/link";
import { Head, Nav } from "../../../components";
import { SeqdbMessage, useSeqdbIntl } from "../../../intl/seqdb-intl";
import { Product } from "../../../types/seqdb-api/resources/Product";

const PRODUCT_TABLE_COLUMNS: ColumnDefinition<Product>[] = [
  {
    Cell: ({ original: { id, name } }) => (
      <Link href={`/seqdb/product/view?id=${id}`}>
        <a>{name}</a>
      </Link>
    ),
    accessor: "name"
  },
  "group",
  {
    Header: "UPC",
    accessor: "upc"
  },
  "type",
  "description"
];

const PRODUCT_FILTER_ATTRIBUTES = ["name", "upc", "type", "description"];

export default function ProductListPage() {
  const { formatMessage } = useSeqdbIntl();

  return (
    <>
      <Head title={formatMessage("productListTitle")} />
      <Nav />
      <ButtonBar>
        <CreateButton entityLink="/seqdb/product" />
      </ButtonBar>
      <div className="container-fluid">
        <h1>
          <SeqdbMessage id="productListTitle" />
        </h1>
        <ListPageLayout
          filterAttributes={PRODUCT_FILTER_ATTRIBUTES}
          id="product-list"
          queryTableProps={{
            columns: PRODUCT_TABLE_COLUMNS,
            path: "seqdb-api/product"
          }}
        />
      </div>
    </>
  );
}