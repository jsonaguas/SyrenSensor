import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { simulateWearableUpload } from "./functions/simulateWearableUpload/resource";

defineBackend({
	auth,
	data,
	simulateWearableUpload
});
