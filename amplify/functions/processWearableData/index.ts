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
  // const rawTable = process.env.RAW_TABLE_NAME!;
  // const snapshotTable = process.env.SNAPSHOT_TABLE_NAME!;

  // 1. Scan for raw entries that haven’t been processed
  const rawData = await docClient.send(
    new ScanCommand({
      TableName: process.env.RAW_TABLE_NAME="WearableRawData-fcq64uo7unhf3oby7fnu3iahsi-NONE",
      FilterExpression: "attribute_not_exists(processed)",
    })
  );

  if (!rawData.Items || rawData.Items.length === 0) {
    console.log("No new data to process.");
    return;
  }

  for (const item of rawData.Items) {
    const { userID, timestamp, rawHeartRate, rawO2 } = item;

    // 2. Write processed snapshot
    await docClient.send(
      new PutCommand({
        TableName: process.env.SNAPSHOT_TABLE_NAME="HealthSnapshot-fcq64uo7unhf3oby7fnu3iahsi-NONE",
        Item: {
          userID,
          timestamp,
          heartRate: rawHeartRate,
          oxygenLevel: rawO2,
        },
      })
    );

    // 3. Optionally mark raw item as processed
await docClient.send(
  new UpdateCommand({
    TableName: process.env.RAW_TABLE_NAME="WearableRawData-fcq64uo7unhf3oby7fnu3iahsi-NONE",
    Key: {
      userID,
      timestamp,
    },
    UpdateExpression: "SET processed = :val",
    ExpressionAttributeValues: {
      ":val": true,
    },
  })
);
  }

  console.log(`Processed ${rawData.Items.length} items.`);
};
