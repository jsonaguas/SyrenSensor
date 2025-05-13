import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async () => {
  const fakeUserID = "user123";

  const healthSnapshot = {
    userID: fakeUserID,
    heartRate: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
    oxygenLevel: Math.floor(Math.random() * (100 - 95 + 1)) + 95,
    timestamp: new Date().toISOString(),
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: process.env.HEALTH_TABLE_NAME="HealthSnapshot-fcq64uo7unhf3oby7fnu3iahsi-NONE",
        Item: healthSnapshot,
      })
    );
    console.log("Snapshot saved:", healthSnapshot);
  } catch (err) {
    console.error("Write failed:", err);
    throw err;
  }
};