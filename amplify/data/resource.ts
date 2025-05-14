import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  HealthSnapshot: a
    .model({
      userID: a.id(),
      heartRate: a.integer(),
      oxygenLevel: a.integer(),
      timestamp: a.timestamp(),
    })
    .authorization((allow) => [allow.owner()])
    .secondaryIndexes((index) => [
      index("userID").sortKeys(["timestamp"])
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
