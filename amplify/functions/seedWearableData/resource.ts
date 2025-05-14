import { defineFunction } from "@aws-amplify/backend";

export const seedWearableData = defineFunction({
  name: "seedWearableData",
  entry: "./index.ts",
  environment: {
    RAW_TABLE_NAME: process.env.DATA_WEARABLERAWDATA_NAME!,
  },
});
