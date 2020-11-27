import {
  ApiClientContext,
  ButtonBar,
  CancelButton,
  DateField,
  ErrorViewer,
  filterBy,
  LoadingSpinner,
  NumberField,
  Query,
  ResourceSelectField,
  safeSubmit,
  SelectField,
  SubmitButton,
  TextField,
  useGroupSelectOptions
} from "common-ui";
import { Form, Formik } from "formik";
import { WithRouterProps } from "next/dist/client/with-router";
import { NextRouter, withRouter } from "next/router";
import { useContext } from "react";
import { Head, Nav } from "../../../components";
import { SeqdbMessage, useSeqdbIntl } from "../../../intl/seqdb-intl";
import { PcrPrimer } from "../../../types/seqdb-api/resources/PcrPrimer";
import { Region } from "../../../types/seqdb-api/resources/Region";

interface PcrPrimerFormProps {
  primer?: PcrPrimer;
  router: NextRouter;
}

export function PcrPrimerEditPage({ router }: WithRouterProps) {
  const { id } = router.query;
  const { formatMessage } = useSeqdbIntl();

  return (
    <div>
      <Head title={formatMessage("editPcrPrimerTitle")} />
      <Nav />
      <div className="container-fluid">
        {id ? (
          <div>
            <h1>
              <SeqdbMessage id="editPcrPrimerTitle" />
            </h1>
            <Query<PcrPrimer>
              query={{ include: "region", path: `seqdb-api/pcrPrimer/${id}` }}
            >
              {({ loading, response }) => (
                <div>
                  <LoadingSpinner loading={loading} />
                  {response && (
                    <PcrPrimerForm primer={response.data} router={router} />
                  )}
                </div>
              )}
            </Query>
          </div>
        ) : (
          <div>
            <h1>
              <SeqdbMessage id="addPcrPrimerTitle" />
            </h1>
            <PcrPrimerForm router={router} />
          </div>
        )}
      </div>
    </div>
  );
}

function PcrPrimerForm({ primer, router }: PcrPrimerFormProps) {
  const { save } = useContext(ApiClientContext);
  const { id } = router.query;
  const groupSelectOptions = useGroupSelectOptions();

  const initialValues = primer || {
    group: groupSelectOptions[0].value,
    lotNumber: 1,
    seq: "",
    type: "PRIMER"
  };

  const onSubmit = safeSubmit(async submittedValues => {
    const response = await save(
      [
        {
          resource: submittedValues,
          type: "pcrPrimer"
        }
      ],
      { apiBaseUrl: "/seqdb-api" }
    );

    const newId = response[0].id;
    await router.push(`/pcr-primer/view?id=${newId}`);
  });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form translate={undefined}>
        <ButtonBar>
          <SubmitButton />
          <CancelButton
            entityId={id as string}
            entityLink="/seqdb/pcr-primer"
          />
        </ButtonBar>
        <ErrorViewer />
        <div>
          <div className="row">
            <SelectField
              className="col-md-2"
              disabled={true}
              name="group"
              options={groupSelectOptions}
            />
          </div>
          <div className="row">
            <SelectField
              className="col-md-2"
              name="type"
              label="Primer Type"
              options={PRIMER_TYPE_OPTIONS}
            />
          </div>
          <div className="row">
            <ResourceSelectField<Region>
              className="col-md-2"
              name="region"
              filter={filterBy(["name"])}
              label="Target Gene Region"
              model="seqdb-api/region"
              optionLabel={region => region.name}
            />
            <TextField className="col-md-2" name="name" />
            <NumberField className="col-md-2" name="lotNumber" />
            <TextField className="col-md-2" name="targetSpecies" />
            <TextField className="col-md-2" name="purification" />
          </div>
          <div className="row">
            <TextField className="col-md-2" name="direction" />
            <TextField className="col-md-2" name="tmCalculated" />
            <DateField className="col-md-2" name="dateOrdered" />
          </div>
          <div className="row">
            <TextField
              className="col-md-6"
              name="seq"
              label="Primer Sequence (5' - 3')"
            />
          </div>
          <div className="row">
            <TextField className="col-md-2" name="application" />
            <TextField className="col-md-2" name="reference" />
            <TextField className="col-md-2" name="supplier" />
            <TextField className="col-md-2" name="designedBy" />
            <TextField
              className="col-md-2"
              name="stockConcentration"
              label="Stock Concentration(uM)"
            />
          </div>
          <div className="row">
            <TextField className="col-md-6" name="note" />
          </div>
        </div>
      </Form>
    </Formik>
  );
}

const PRIMER_TYPE_OPTIONS = [
  {
    label: "PCR Primer",
    value: "PRIMER"
  },
  {
    label: "454 Multiplex Identifier",
    value: "MID"
  },
  {
    label: "Fusion Primer",
    value: "FUSION_PRIMER"
  },
  {
    label: "Illumina Index",
    value: "ILLUMINA_INDEX"
  },
  {
    label: "iTru Primer",
    value: "ITRU_PRIMER"
  }
];

export default withRouter(PcrPrimerEditPage);
