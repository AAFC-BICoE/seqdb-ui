import {
  ApiClientContext,
  ButtonBar,
  BackButton,
  DinaForm,
  EditButton,
  FieldView,
  useQuery,
  withResponse
} from "common-ui";
import { KitsuResponse } from "kitsu";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import { Person } from "packages/dina-ui/types/agent-api/resources/Person";
import { useContext, useState } from "react";
import { Footer, GroupFieldView, Head, Nav } from "../../components";
import { DinaMessage, useDinaIntl } from "../../intl/dina-ui-intl";
import { CollectingEvent } from "../../types/collection-api/resources/CollectingEvent";
import { FieldArray } from "formik";
import { GeoReferenceAssertionRow } from "../../components/collection/GeoReferenceAssertionRow";
import { AttachmentReadOnlySection } from "../../components/object-store/attachment-list/AttachmentReadOnlySection";

export function CollectingEventDetailsPage({ router }: WithRouterProps) {
  const { id } = router.query;
  const { formatMessage } = useDinaIntl();
  const { bulkGet } = useContext(ApiClientContext);
  const [collectingEvent, setCollectingEvent] = useState<CollectingEvent>();

  const getAgents = (response: KitsuResponse<CollectingEvent, undefined>) => {
    const fetchAgents = async () => {
      if (response?.data?.collectors) {
        return await bulkGet<Person>(
          response?.data?.collectors.map(
            collector => `/person/${collector.id}`
          ) as any,
          { apiBaseUrl: "/agent-api" }
        );
      }
    };
    const agents = fetchAgents();
    agents
      .then(async () => {
        response.data.collectors = await agents;
        setCollectingEvent(response.data);
      })
      .finally(() => setCollectingEvent(response.data));
  };

  const collectingEventQuery = useQuery<CollectingEvent>(
    {
      path: `collection-api/collecting-event/${id}`,
      include: "attachment,collectors,geoReferenceAssertions"
    },
    {
      onSuccess: getAgents
    }
  );

  return (
    <div>
      <Head title={formatMessage("collectingEventViewTitle")} />
      <Nav />
      <ButtonBar>
        <EditButton entityId={id as string} entityLink="collecting-event" />
        <BackButton
          entityId={id as string}
          entityLink="/collecting-event"
          byPassView={true}
        />
      </ButtonBar>
      {withResponse(collectingEventQuery, ({ data: colEvent }) => {
        if (colEvent.createdOn) {
          const inUserTimeZone = new Date(colEvent.createdOn).toString();
          if (collectingEvent) collectingEvent.createdOn = inUserTimeZone;
        }

        return (
          <main className="container-fluid">
            <h1>
              <DinaMessage id="collectingEventViewTitle" />
            </h1>
            <div>
              {collectingEvent && (
                <DinaForm<CollectingEvent> initialValues={collectingEvent}>
                  <div>
                    <div className="form-group">
                      <div className="row">
                        <GroupFieldView
                          className="col-md-2"
                          name="group"
                          label={formatMessage("field_group")}
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <fieldset className="border p-2">
                            <legend className="w-auto">
                              <DinaMessage id="collectingDateLegend" />
                            </legend>
                            <FieldView
                              className="col-md-12"
                              name="startEventDateTime"
                              label={formatMessage("startEventDateTimeLabel")}
                            />
                            {collectingEvent.endEventDateTime && (
                              <FieldView
                                className="col-md-12"
                                name="endEventDateTime"
                                label={formatMessage("endEventDateTimeLabel")}
                              />
                            )}
                            <FieldView
                              className="col-md-12"
                              name="verbatimEventDateTime"
                              label={formatMessage(
                                "verbatimEventDateTimeLabel"
                              )}
                            />
                          </fieldset>
                          <fieldset className="border p-2">
                            <legend className="w-auto">
                              <DinaMessage id="collectingAgentsLegend" />
                            </legend>
                            <FieldView
                              className="col-md-12"
                              name="dwcRecordedBy"
                            />
                            <FieldView
                              className="col-md-12"
                              name="collectors"
                            />
                            <FieldView
                              className="col-md-12"
                              name="dwcRecordNumber"
                            />
                            <FieldView
                              className="col-md-12"
                              name="dwcOtherRecordNumbers"
                            />
                          </fieldset>
                          <fieldset className="border p-2">
                            <legend className="w-auto">
                              <DinaMessage id="geographyLegend" />
                            </legend>
                          </fieldset>
                        </div>
                        <div className="col-md-6">
                          <fieldset className="border p-2">
                            <legend className="w-auto">
                              <DinaMessage id="verbatimCoordinatesLegend" />
                            </legend>
                            <FieldView
                              className="col-md-12"
                              name="dwcVerbatimLocality"
                            />
                            <FieldView
                              className="col-md-12"
                              name="dwcVerbatimLatitude"
                            />
                            <FieldView
                              className="col-md-12"
                              name="dwcVerbatimLongitude"
                            />
                            <FieldView
                              className="col-md-12"
                              name="dwcVerbatimCoordinates"
                            />
                          </fieldset>
                          <fieldset className="border p-2">
                            <legend className="w-auto">
                              <DinaMessage id="geoReferencingLegend" />
                            </legend>
                            {collectingEvent?.geoReferenceAssertions
                              ?.length && collectingEvent?.geoReferenceAssertions
                              ?.length > 0  && (
                              <ul>
                                <FieldArray name="geoReferenceAssertions">
                                  {() =>
                                    collectingEvent?.geoReferenceAssertions?.map(
                                      (assertion, index) => (
                                        <li
                                          className="list-group-item"
                                          key={assertion.id}
                                        >
                                          <GeoReferenceAssertionRow
                                            index={index}
                                            viewOnly={true}
                                          />
                                        </li>
                                      )
                                    )
                                  }
                                </FieldArray>
                              </ul>
                            )}
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </div>
                </DinaForm>
              )}
              <div className="form-group">
                <AttachmentReadOnlySection
                  attachmentPath={`collection-api/collecting-event/${id}/attachment`}
                  detachTotalSelected={true}
                />
              </div>
            </div>
          </main>
        );
      })}
      <Footer />
    </div>
  );
}

export default withRouter(CollectingEventDetailsPage);
