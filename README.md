## Syren Sensor Health App

Our project is a health monitoring application that will hypothetically connect to wearable devices to track vital signs over time. It can also use this information to automate EMS calling in the event of an emergency. Our app is hosted and deployed using Amazon Web Services Amplify with a backend that uses Lambda Functions to communicate with our DynamoDB database.

## Overview

The backbone of our project is a React frontend with AWS Cognito, Lambda, API Gateway, and DynamoDB handling and configuring deployment, backend, and security.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Configured using AWS API Gateway.
- **Database**: Real-time database powered by Amazon DynamoDB.
- **HTTP Requests**: HTTP requests are made through URL endpoints that reference our Lambda Functions and the User ID JWT provided by the Cognito user pool
- **State Management**: Project state is managed between components using React's Context API
- **Navigation**: Project navigation is managed using React Router DOM
- **Styling** : Styling is consistently applied using consistent coloing and dark theme across all components using Tailwind CSS. Tailwind also applies appropriate formatting at various breakpoints to ensure smooth operation across all device sizes.
- **Graphs and Charts**: Our linegraph feature was designed using the Recharts dependency
- **Calling**: Our calling logic activates a two way modal with th option to confirm or cancel the call within 60 seconds. After a 60 second timeout the call is automated using an href with a tel: endpoint. This modal can be activated manually or is automated if patient vitals fall outside appropriate bands such as skin temperature rising above 105 degrees or below 95 degrees, pulse rising past 220 bpm or falling below 30 bpm, or blood oxygen saturation falling below 90 percent.
- **Settings**: A settings form to adjust or update patient information and vitals manually. This component will start with populated values from our DynamoDB as Lambda Functions are referenced to set our state in context prior to the component loading.
- **Registration Form**: After verifying new users in our Cognito user pool during first sign in users will be directed to out CompleteRegistration component form to set up Emergency Contact and biographical information during first use. This information will then be saved to our DynamoDB and available for future reference in the Dashboard and Settings.
- **Patient Dashboard**: On our patient dashboard patient biographical information, current vitals \(generated randomly by Lambda Functions until we can configure actual bluetooth device integration and functionality\) and our rechart line graph are all displayed in a responsive and stylized format.


## Deploying to AWS

Our deployed link can be reached [here](https://dev-ja.d113xysrintyrk.amplifyapp.com/dashboard/)

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.