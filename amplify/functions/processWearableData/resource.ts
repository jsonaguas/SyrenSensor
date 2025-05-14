import { defineFunction } from "@aws-amplify/backend";
import { Duration } from "aws-cdk-lib";
import { Schedule, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";


export const processWearableData = defineFunction((scope) => {
  const fn = new NodejsFunction(scope, "ProcessWearableData", {
    entry: "./amplify/functions/processWearableData/index.ts",
    runtime: Runtime.NODEJS_18_X,
    environment: {
      RAW_TABLE_NAME: process.env.DATA_WEARABLERAWDATA_NAME!, // 🔁 change to your actual raw table name
      SNAPSHOT_TABLE_NAME: process.env.DATA_HEALTHSNAPSHOT_NAME!,
    },
  });

  new Rule(scope, "EveryTenMinutes", {
    schedule: Schedule.rate(Duration.minutes(10)),
    targets: [new LambdaFunction(fn)],
  });

  return fn;
});
