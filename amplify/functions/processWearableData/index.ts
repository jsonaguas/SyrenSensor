import {
  DynamoDBClient,
  ScanCommand
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async () => {
  const rawTable = process.env.RAW_TABLE_NAME!;
  const snapshotTable = process.env.SNAPSHOT_TABLE_NAME!;

  const rawData = await docClient.send(
    new ScanCommand({
      TableName: rawTable,
      FilterExpression: "attribute_not_exists(#processed)",
      ExpressionAttributeNames: {
        "#processed": "processed",
      },
    })
  );

  const items = rawData.Items ?? [];

  if (items.length === 0) {
    console.log("No new data to process.");
    return {
      statusCode: 200,
      body: "No unprocessed items found.",
    };
  }

  for (const item of items) {
    const { id, userID, timestamp, rawHeartRate, rawO2 } = item;

    if (!id ||!userID || !timestamp) {
      console.warn("Skipping invalid item:", item);
      continue;
    }

    // 2. Create HealthSnapshot
    await docClient.send(
      new PutCommand({
        TableName: snapshotTable,
        Item: {
          id,
          userID,
          timestamp,
          heartRate: rawHeartRate,
          oxygenLevel: rawO2,
        },
      })
    );

    // 3. Mark raw data item as processed
    await docClient.send(
      new UpdateCommand({
        TableName: rawTable,
        Key: { userID, timestamp},
        UpdateExpression: "SET #processed = :true",
        ExpressionAttributeNames: {
          "#processed": "processed",
        },
        ExpressionAttributeValues: {
          ":true": true,
        },
      })
    );
  }

  console.log(`✅ Processed ${items.length} item(s).`);
  return {
    statusCode: 200,
    body: `Processed ${items.length} item(s).`,
  };
};