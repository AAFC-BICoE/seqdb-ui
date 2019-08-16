import { connect, Form, Formik, FormikActions } from "formik";
import { useState } from "react";
import {
  ColumnDefinition,
  FilterBuilderField,
  NumberField,
  QueryTable,
  ResourceSelectField,
  SelectField,
  SubmitButton,
  TextField
} from "../..";
import {
  Product,
  Protocol,
  Sample,
  StepResource
} from "../../../types/seqdb-api";
import { filterBy } from "../../../util/rsql";
import { rsql } from "../../filter-builder/rsql";
import { useGroupedCheckBoxes } from "../../formik-connected/GroupedCheckBoxFields";
import { StepRendererProps } from "../StepRenderer";
import { usePreLibraryPrepControls } from "./usePreLibraryPrepControls";

export function PreLibraryPrepStep(props: StepRendererProps) {
  const { chain, chainStepTemplates, step } = props;

  const {
    plpFormSubmit,
    plpSrLoading,
    plpSrResponse,
    setVisibleSamples
  } = usePreLibraryPrepControls(props);

  const previousStep = chainStepTemplates[chainStepTemplates.indexOf(step) - 1];

  const [rsqlFilter, setRsqlFilter] = useState<string>("");

  const { CheckBoxField, setAvailableItems } = useGroupedCheckBoxes<Sample>({
    fieldName: "checkedIds"
  });

  function onFilterSubmit(values, { setSubmitting }: FormikActions<any>) {
    setRsqlFilter(rsql(values.filter));
    setSubmitting(false);
  }

  const SAMPLE_STEP_RESOURCE_COLUMNS: Array<ColumnDefinition<StepResource>> = [
    {
      Header: "Group",
      accessor: "sample.group.groupName"
    },
    "sample.name",
    "sample.version",
    {
      Cell: ({ original }) => {
        if (plpSrLoading || !original.sample) {
          return "Loading...";
        }

        const plpSr = plpSrResponse.data.find(
          sr => sr.sample.id === original.sample.id && sr.value === "SHEARING"
        );
        if (plpSr) {
          return (
            <div style={{ backgroundColor: "rgb(222, 252, 222)" }}>Sheared</div>
          );
        }
        return <span>Not Sheared</span>;
      },
      Header: "Shearing",
      sortable: false
    },
    {
      Cell: ({ original }) => {
        if (plpSrLoading || !original.sample) {
          return "Loading...";
        }
        const stepResource = plpSrResponse.data.find(
          sr =>
            sr.sample.id === original.sample.id && sr.value === "SIZE_SELECTION"
        );
        if (stepResource) {
          return (
            <div style={{ backgroundColor: "rgb(222, 252, 222)" }}>
              Size Selection Added
            </div>
          );
        }
        return <span>No Size Selection</span>;
      },
      Header: "Size Selection",
      sortable: false
    },
    {
      Cell: ({ original: sr }) => (
        <div style={{ textAlign: "center" }} key={sr.id}>
          <div className="d-block">
            <CheckBoxField resource={sr.sample} />
          </div>
        </div>
      ),
      sortable: false
    }
  ];

  return (
    <>
      <h2>Shearing/Size Selection</h2>
      <strong>Filter samples:</strong>
      <Formik initialValues={{ filter: null }} onSubmit={onFilterSubmit}>
        <Form className="form-group">
          <FilterBuilderField
            filterAttributes={["sample.name"]}
            name="filter"
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </Form>
      </Formik>
      <Formik
        initialValues={{ checkedIds: {}, preLibraryPrepType: "SHEARING" }}
        onSubmit={plpFormSubmit}
      >
        <Form>
          <div className="row form-group">
            <div className="col-6">
              <strong>Selected Samples</strong>
              <QueryTable
                columns={SAMPLE_STEP_RESOURCE_COLUMNS}
                defaultPageSize={100}
                filter={{
                  "chain.chainId": chain.id,
                  "chainStepTemplate.chainStepTemplateId": previousStep.id,
                  rsql: rsqlFilter
                }}
                include="sample,sample.group"
                onSuccess={res => {
                  setVisibleSamples(res.data);
                  setAvailableItems(res.data.map(sr => sr.sample));
                }}
                path="stepResource"
              />
            </div>
            <div className="col-6">
              <strong>Add New Shearing/Size Selection Details</strong>
              {/* Spacer div to align the table with the form. */}
              <div style={{ height: "22px" }} />
              <PreLibraryPrepForm />
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
}

const PreLibraryPrepForm = connect<{}, any>(
  ({ formik: { values, resetForm } }) => {
    function onTypeChange(newType?: string) {
      const checkedIds = values.checkedIds;
      resetForm({ checkedIds, preLibraryPrepType: newType });
    }

    return (
      <div className="card card-body">
        <div className="row">
          <SelectField
            className="col-6"
            onChange={onTypeChange}
            options={PREP_TYPE_OPTIONS}
            name="preLibraryPrepType"
          />
          <NumberField className="col-6" name="inputAmount" />
          <NumberField className="col-6" name="concentration" />
          <NumberField className="col-6" name="targetDpSize" />
          <NumberField className="col-6" name="averageFragmentSize" />
          <TextField className="col-6" name="quality" />
          <ResourceSelectField<Protocol>
            className="col-6"
            filter={filterBy(["name"])}
            name="protocol"
            model="protocol"
            optionLabel={protocol => protocol.name}
          />
          <ResourceSelectField<Product>
            className="col-6"
            filter={filterBy(["name"])}
            label="Kit"
            model="product"
            name="product"
            optionLabel={kit => kit.name}
          />
          <TextField className="col-12" name="notes" />
        </div>
        <div>
          <SubmitButton />
        </div>
      </div>
    );
  }
);

const PREP_TYPE_OPTIONS = [
  {
    label: "Shearing",
    value: "SHEARING"
  },
  {
    label: "Size Selection",
    value: "SIZE_SELECTION"
  }
];
