# Syren Sensor - My Personal Contributions

This is a personal fork of the [Syren Sensor] (https://github.com/MatthewGUser/Syren-Sensor/tree/main) 
project, where I worked on backend infrastructure for emergency health monitoring
using AWS services with a small interdisciplinary team of frontend and cybersecurity
for the Coding Temple's bootcamp Tech Residency. Peruse the code on the branch [dev-JA].

## Contributions
I contributed to core backend functionality, especially around health data ingestion,
emergency response logic, and secure API access. 

### Technical Highlights 
- Built Lambda functions to:
    - Simulate wearable health vitals with randomized data
    - Import and process vitals into a separate DynamoDB table
    - Retrieve the most recent health snapshot for a user
    - Aggregrate 30-day vitals data for visualization
- Integrate Recharts to display a 30-day line graph of vitals in the frontend dashboard
- Developed secure REST APIs using API Gateway and Lambda to:
    - Retrieve user health data based on Cognito registration
    - Post additional user registration data (emergency contacts, user attributes)
    - Send authorized requests to the Fitbit API using Cognito's OAuth bearer token
- Personalized the app experience by:
    - Displaying user-specific info (e.g., name, height, weight) on the dashboard
    and settings pages
    - Automatically detecting first-time logins and showing a custom registration
    form
- Simulate Fitbit wearable integration by:
    - Implementing the OAuth 2.0 flow for user authorization
    - Exchanging the Fitbit code for access tokens and storing them securely
- Managed IAM permissions to:
    - Allow Lambda functions to read/write across multiple DynamoDB tables
    - Secure API endpoints based on user authentication context

