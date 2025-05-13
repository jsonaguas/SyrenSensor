import { defineFunction } from "@aws-amplify/backend";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
// import { Duration } from "aws-cdk-lib";
// import { Rule, Schedule } from "aws-cdk-lib/aws-events";
// import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Runtime } from "aws-cdk-lib/aws-lambda";


export const simulateWearableUpload = defineFunction((scope) => {
  const fn = new NodejsFunction(scope, "SimulateWearableUpload", {
    entry: "./amplify/functions/simulateWearableUpload/index.ts",
    runtime: Runtime.NODEJS_18_X,
    environment: {
      HEALTH_TABLE_NAME: process.env.DATA_HEALTHSNAPSHOT_NAME!,
    },
  });

  // new Rule(scope, "HourlySchedule", {
  //   schedule: Schedule.rate(Duration.minutes(10)),
  //   targets: [new LambdaFunction(fn)],
  // });

  return fn;
});
