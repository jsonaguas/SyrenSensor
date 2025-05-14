import { defineFunction } from "@aws-amplify/backend";

export const seedWearableData = defineFunction({
  name: "seedWearableData",
  entry: "./index.ts",
  environment: {
    NEW_TABLE_NAME: "wearableRawData",
  },
});
