import { defineFunction } from "@aws-amplify/backend";
import { data } from "../../data/resource";

export const seedWearableData = defineFunction({
  name: "seedWearableData",
  entry: "./index.ts",
  environment: {
    NEW_TABLE_NAME: data.WearableRawData.name,
  },
});
