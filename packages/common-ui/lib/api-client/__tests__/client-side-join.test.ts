import { ClientSideJoiner } from "../client-side-join";

const mockBulkGet = jest.fn();

describe("ClientSideJoiner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Joins Metadatas to Agents", async () => {
    const metadatas = [
      {
        acMetadataCreator: "a08211f2-aee4-443f-a224-a7768cd9d588",
        exampleField: "example-value",
        id: "ac4baae6-045e-4015-aeb6-1f6fd4766a1c",
        type: "metadata"
      },
      {
        // Same acMetadataCreator value as previous record:
        acMetadataCreator: "a08211f2-aee4-443f-a224-a7768cd9d588",
        exampleField: "example-value",
        id: "15c30e4d-7788-49d0-848d-447479c9f89e",
        type: "metadata"
      },
      {
        acMetadataCreator: "6328f159-78d9-401e-8273-74e90ea58d81",
        exampleField: "example-value",
        id: "1b35311f-225f-4102-9067-6e201caacd13",
        type: "metadata"
      },
      // No acMetadataCreator:
      {
        exampleField: "example-value",
        id: "2c5c2ef1-ffae-4648-95a7-76f5a5d8a0e2",
        type: "metadata"
      }
    ];

    const clientSideJoiner = new ClientSideJoiner(mockBulkGet, metadatas, {
      apiBaseUrl: "/agent-api",
      idField: "acMetadataCreator",
      joinField: "acMetadataCreator",
      path: metadata => `agent/${metadata.acMetadataCreator}`
    });

    mockBulkGet.mockReturnValueOnce([
      {
        displayName: "Agent1",
        id: "a08211f2-aee4-443f-a224-a7768cd9d588",
        type: "agent"
      },
      {
        displayName: "Agent2",
        id: "6328f159-78d9-401e-8273-74e90ea58d81",
        type: "agent"
      }
    ]);

    await clientSideJoiner.join();

    // Bulk get is called once, with unique agent ids.
    // There were 2 unique agent IDs in the
    expect(mockBulkGet).lastCalledWith(
      [
        "agent/a08211f2-aee4-443f-a224-a7768cd9d588",
        "agent/6328f159-78d9-401e-8273-74e90ea58d81"
      ],
      { apiBaseUrl: "/agent-api" }
    );

    // The first 3 records are joined to Agents.
    // The last record is not joined to an Agent.
    expect(metadatas).toEqual([
      {
        acMetadataCreator: {
          displayName: "Agent1",
          id: "a08211f2-aee4-443f-a224-a7768cd9d588",
          type: "agent"
        },
        exampleField: "example-value",
        id: "ac4baae6-045e-4015-aeb6-1f6fd4766a1c",
        type: "metadata"
      },
      {
        acMetadataCreator: {
          displayName: "Agent1",
          id: "a08211f2-aee4-443f-a224-a7768cd9d588",
          type: "agent"
        },
        exampleField: "example-value",
        id: "15c30e4d-7788-49d0-848d-447479c9f89e",
        type: "metadata"
      },
      {
        acMetadataCreator: {
          displayName: "Agent2",
          id: "6328f159-78d9-401e-8273-74e90ea58d81",
          type: "agent"
        },
        exampleField: "example-value",
        id: "1b35311f-225f-4102-9067-6e201caacd13",
        type: "metadata"
      },
      {
        exampleField: "example-value",
        id: "2c5c2ef1-ffae-4648-95a7-76f5a5d8a0e2",
        type: "metadata"
      }
    ]);
  });
});