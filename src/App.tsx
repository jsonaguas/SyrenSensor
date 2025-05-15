// import { useEffect, useState } from "react";
// import { Schema } from "../amplify/data/schema";
// import { generateClient } from "aws-amplify/data";
// import { useAuthenticator } from "@aws-amplify/ui-react";


// const client = generateClient<Schema>();

// function App() {
// 	const { user, signOut } = useAuthenticator();
// 	const [latestSnapshot, setLatestSnapshot] = useState<Schema["HealthSnapshot"]["type"] | null>(null);


// 	useEffect(() => {
// 		if (!user) return;

// 		client.models.HealthSnapshot.list({
// 			filter: {
// 				userID: { eq: user.signInDetails?.loginId },
// 			},
// 		})
// 			.then((res) => {
// 				if (res.data.length > 0) {
// 					// Sort by timestamp descending and pick the latest
// 					const sorted = [...res.data].sort((a, b) => (b.timestamp as number) - (a.timestamp as number));
// 					setLatestSnapshot(sorted[0]);
// 				}
// 			})
// 			.catch((err) => {
// 				console.error("Failed to load latest vitals", err);
// 			});
// 	}, [user]);



// 	function createHealthSnapshot() {
// 		const heartRateInput = window.prompt("Enter heart rate:");
// 		const oxygenLevelInput = window.prompt("Enter oxygen level:");

// 		const heartRate = parseInt(heartRateInput ?? "", 10);
// 		const oxygenLevel = parseInt(oxygenLevelInput ?? "", 10);

// 		if (isNaN(heartRate) || isNaN(oxygenLevel)) {
// 			alert("Please enter valid numbers.");
// 			return;
// 		}

// 		client.models.HealthSnapshot.create({
// 			userID: user?.signInDetails?.loginId ?? "unknown",
// 			heartRate,
// 			oxygenLevel,
// 			timestamp: Date.now(),
// 		})
// 			.then((res) => {
// 				console.log("HealthSnapshot created:", res);
// 				alert("Snapshot created!");
// 			})
// 			.catch((err) => {
// 				console.error("Error creating HealthSnapshot:", err);
// 				alert("Failed to create snapshot.");
// 			});
// 	}
// 	return (
// 		<main>
// 			{latestSnapshot && (
// 				<div>
// 					<h2>Latest Health Snapshot</h2>
// 					<p>Heart Rate: {latestSnapshot.heartRate}</p>
// 					<p>Oxygen Level: {latestSnapshot.oxygenLevel}</p>
// 					<p>Timestamp: {new Date(latestSnapshot.timestamp as number).toLocaleString()}</p>
// 				</div>
// 			)}
// 			<div>
// 							🥳 App successfully hosted. Try creating a new todo.
// 							<br />
// 							<a href='https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates'>
// 								Review next step of this tutorial.
// 							</a>
// 			</div>
// 			<button onClick={signOut}>Sign out</button>
// 			<button onClick={createHealthSnapshot}>Create Health Snapshot</button>
// 		</main>
// 	);
// }

// export default App;

import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

function App() {
  const { user, signOut } = useAuthenticator();
  type HealthSnapshot = {
	userID: string;
	heartRate: number;
	oxygenLevel: number;
	timestamp: string;
  };
  const [latestSnapshot, setLatestSnapshot] = useState<HealthSnapshot | null>(null);

  async function getAuthToken() {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    const accessToken = session.tokens?.accessToken?.toString();
    return { idToken, accessToken };
  }

  useEffect(() => {
    if (!user) return;

   async function fetchVitals() {
  try {
    const { idToken } = await getAuthToken();

    const url = `https://lesiun05ul.execute-api.us-east-1.amazonaws.com/demo/getLatestVitals?userID=${encodeURIComponent(user.signInDetails?.loginId ?? "")}`;
    console.log("🌐 Requesting:", url);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    console.log("📥 Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log("📊 Fetched data:", data);
    setLatestSnapshot(data);

  } catch (err) {
    console.error("❌ Error fetching vitals:", err);
  }
}
    fetchVitals();
  }, [user]);

  return (
    <main>
      {latestSnapshot ? (
        <div>
          <h2>Latest Vitals</h2>
          <p>Heart Rate: {latestSnapshot.heartRate}</p>
          <p>Oxygen Level: {latestSnapshot.oxygenLevel}</p>
          <p>Timestamp: {new Date(Number(latestSnapshot.timestamp)).toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading latest vitals...</p>
      )}
      <button onClick={signOut}>Sign Out</button>
    </main>
  );
}

export default App;
