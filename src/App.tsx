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
import { Route, Routes, Navigate } from 'react-router-dom';
import PatientDashboard from "./components/PatientDashboard";
import Settings from "./components/Settings";
import NavBar from './components/NavBar';
import { SettingsProvider, useSettingsContext } from './context/SettingsContext';

function EMSModal() {
	const { settingsState, handleCallEMS, handleCancelEMS } = useSettingsContext();

	if (!settingsState.emsModalOpen) return null;

	return (
		<div 
		role='dialog'
		aria-modal='true'
		aria-labelledby='ems-model-title'
		aria-describedby='ems-modal-description'
		className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
		<div className="bg-white p-6 rounded-lg max-w-sm w-full">
			<h2 id='ems-modal-title' className="text-lg font-semibold mb-2">Emergency Activation</h2>
			<p id=';ems-modal-description' className='mb-4'>Critical vitals detected. Do you want to call an EMS dispatcher?</p>
			<div className="mt-4 flex justify-between">
			<button
				aria-label='Cancel automatic EMS call'
				onClick={handleCancelEMS}
				className="text-black bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
			>
				Cancel
			</button>
			<button
				aria-label='Confirm EMS call now'
				onClick={handleCallEMS}
				className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md"
			>
				Call EMS
			</button>
			</div>
			<p className="text-xs text-gray-600 mt-4 text-center" aria-live='assertive'>
			Automatically calling in 60 seconds if no action is taken.
			</p>
		</div>
		</div>
	);
}

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
    console.log("Requesting:", url);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log("Fetched data:", data);
    setLatestSnapshot(data);

  } catch (err) {
    console.error("Error fetching vitals:", err);
  }
}
    fetchVitals();
  }, [user]);

  return (
 
<SettingsProvider>
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
			<div className="flex flex-col min-h-screen">
				<div className='flex-grow'>
					<Routes>
						<Route path="/" element={<Navigate to="/dashboard" replace />} />
						<Route path="/dashboard" element ={<PatientDashboard/>}/>
						<Route path="/settings" element ={<Settings/>}/>
					</Routes>
				</div>
				<NavBar/>
				<EMSModal/>
			</div>
			</main>
		</SettingsProvider>

  );
}
export default App;

////////BEN'S CODE


// function App() {
	// const { user  } = useAuthenticator();
	
	// if (!user) {
	// 	return null
	// }
	