import { Formik } from "formik";
import Link from "next/link";
import { withRouter, WithRouterProps } from "next/router";
import { FieldView, Head, LoadingSpinner, Nav, Query } from "../../components";
import { Protocol } from "../../types/seqdb-api/resources/Protocol";

export function ProtocolDetailsPage({ router }: WithRouterProps) {
  const { id } = router.query;
  return (
    <div>
      <Head title="Protocol Details" />
      <Nav />
      <Query<Protocol>
        query={{ include: "group,kit", path: `protocol/${id}` }}
      >
        {({ loading, response }) => (
          <div className="container-fluid">
            <Link href="/protocol/list">
              <a>Protocols</a>
            </Link>
            <h1>Protocols Details</h1>
            <LoadingSpinner loading={loading} />
            {response && (
              <Formik<Protocol> initialValues={response.data} onSubmit={null}>
                <div>
                  <Link href={`/protocol/edit?id=${id}`}>
                    <a>Edit</a>
                  </Link>
                  <div className="row">
                    <FieldView
                      className="col-md-2"
                      name="group.groupName"
                      label="Group Name"
                    />
                  </div>
                  <div className="row">
                    <FieldView className="col-md-2" name="type" />
                    <FieldView className="col-md-2" name="name" />
                    <FieldView className="col-md-2" name="version" />
                    <FieldView className="col-md-2" name="description" />
                  </div>
                  <div className="row">
                    <FieldView className="col-md-8" name="steps" />
                  </div>
                  <div className="row">
                    <FieldView className="col-md-8" name="notes" />
                  </div>
                  <div className="row">
                    <FieldView className="col-md-2" name="reference" />
                    <FieldView className="col-md-2" name="equipment" />
                    <FieldView className="col-md-2" name="kit.name" />
                  </div>
                  <div className="row">
                    <FieldView className="col-md-2" name="lastModified" />
                  </div>
                </div>
              </Formik>
            )}
          </div>
        )}
      </Query>
    </div>
  );
}

export default withRouter(ProtocolDetailsPage);
