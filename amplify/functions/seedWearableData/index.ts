import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async () => {
  // const tableName = process.env.NEW_TABLE_NAME!;
  const userID = "test-user-123";

  const now = new Date();
  const timestamp = now.toISOString();

  const item = {
    userID,
    timestamp,
    rawHeartRate: Math.floor(Math.random() * 40 + 60), // 60–100
    rawO2: Math.floor(Math.random() * 5 + 95),          // 95–100
  };

  await docClient.send(
    new PutCommand({
      TableName:  process.env.RAW_TABLE_NAME="WearableRawData-fcq64uo7unhf3oby7fnu3iahsi-NONE",
      Item: item,
    })
  );

  console.log("Added raw data item:", item);
  console.log("Available ENV VARS:", JSON.stringify(process.env, null, 2));
  return { statusCode: 200, body: JSON.stringify({ message: "Item added", item }) };
};
