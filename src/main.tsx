import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const formFields = {
	signUp: {
		email: {
			order: 1,
		},
		password: {
			order: 2,
		},
		confirm_password: {
			order: 3,
		},
		gender: {
			order: 4,
			label: "Gender",
			placeholder: "Enter your Gender",
		},
		name: {
			order: 5,
		},
		address: {
			order: 6,
		},
		birthdate: {
			order: 7,
		},
		phone_number: {
			order: 8,
		},
	},
};

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Authenticator formFields={formFields}>
			<App />
		</Authenticator>
	</React.StrictMode>
);
