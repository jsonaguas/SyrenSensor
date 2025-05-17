// import { fetchAuthSession } from 'aws-amplify/auth';
// import { useEffect, useState } from 'react';
// import { useAuthenticator } from '@aws-amplify/ui-react';
// import { Route, Routes, Navigate } from 'react-router-dom';
// import PatientDashboard from "./components/PatientDashboard";
// import Settings from "./components/Settings";
// import NavBar from './components/NavBar';
// import { SettingsProvider, useSettingsContext } from './context/SettingsContext';

// function EMSModal() {
// 	const { settingsState, handleCallEMS, handleCancelEMS } = useSettingsContext();

// 	if (!settingsState.emsModalOpen) return null;

// 	return (
// 		<div 
// 		role='dialog'
// 		aria-modal='true'
// 		aria-labelledby='ems-model-title'
// 		aria-describedby='ems-modal-description'
// 		className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
// 		<div className="bg-white p-6 rounded-lg max-w-sm w-full">
// 			<h2 id='ems-modal-title' className="text-lg font-semibold mb-2">Emergency Activation</h2>
// 			<p id=';ems-modal-description' className='mb-4'>Critical vitals detected. Do you want to call an EMS dispatcher?</p>
// 			<div className="mt-4 flex justify-between">
// 			<button
// 				aria-label='Cancel automatic EMS call'
// 				onClick={handleCancelEMS}
// 				className="text-black bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
// 			>
// 				Cancel
// 			</button>
// 			<button
// 				aria-label='Confirm EMS call now'
// 				onClick={handleCallEMS}
// 				className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md"
// 			>
// 				Call EMS
// 			</button>
// 			</div>
// 			<p className="text-xs text-gray-600 mt-4 text-center" aria-live='assertive'>
// 			Automatically calling in 60 seconds if no action is taken.
// 			</p>
// 		</div>
// 		</div>
// 	);
// }

// function App() {
//   const { user, signOut } = useAuthenticator();
//   type HealthSnapshot = {
// 	userID: string;
// 	heartRate: number;
// 	oxygenLevel: number;
// 	timestamp: string;
//   };
//   const [latestSnapshot, setLatestSnapshot] = useState<HealthSnapshot | null>(null);

//   async function getAuthToken() {
//     const session = await fetchAuthSession();
//     const idToken = session.tokens?.idToken?.toString();
//     const accessToken = session.tokens?.accessToken?.toString();
//     return { idToken, accessToken };
//   }

//   useEffect(() => {
//     if (!user) return;

//    async function fetchVitals() {
//   try {
//     const { idToken } = await getAuthToken();

//     const url = `https://lesiun05ul.execute-api.us-east-1.amazonaws.com/demo/getLatestVitals?userID=${encodeURIComponent(user.signInDetails?.loginId ?? "")}`;
//     console.log("Requesting:", url);

//     const res = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${idToken}`,
//       },
//     });

//     console.log("Response status:", res.status);

//     if (!res.ok) {
//       const errorText = await res.text();
//       throw new Error(`HTTP ${res.status}: ${errorText}`);
//     }

//     const data = await res.json();
//     console.log("Fetched data:", data);
//     setLatestSnapshot(data);

//   } catch (err) {
//     console.error("Error fetching vitals:", err);
//   }
// }
//     fetchVitals();
//   }, [user]);

//   return (
 
// <SettingsProvider>
// 	<main>
//       {latestSnapshot ? (
//         <div>
//           <h2>Latest Vitals</h2>
//           <p>Heart Rate: {latestSnapshot.heartRate}</p>
//           <p>Oxygen Level: {latestSnapshot.oxygenLevel}</p>
//           <p>Timestamp: {new Date(Number(latestSnapshot.timestamp)).toLocaleString()}</p>
//         </div>
//       ) : (
//         <p>Loading latest vitals...</p>
//       )}
//       <button onClick={signOut}>Sign Out</button>
// 			<div className="flex flex-col min-h-screen">
// 				<div className='flex-grow'>
// 					<Routes>
// 						<Route path="/" element={<Navigate to="/dashboard" replace />} />
// 						<Route path="/dashboard" element ={<PatientDashboard/>}/>
// 						<Route path="/settings" element ={<Settings/>}/>
// 					</Routes>
// 				</div>
// 				<NavBar/>
// 				<EMSModal/>
// 			</div>
// 			</main>
// 		</SettingsProvider>

//   );
// }
// export default App;

import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import PatientDashboard from "./components/PatientDashboard";
import Settings from "./components/Settings";
import NavBar from './components/NavBar';
import { SettingsProvider, useSettingsContext } from './context/SettingsContext';
import CompleteRegistration from './components/CompleteRegistration';
import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from '@aws-amplify/auth';

function EMSModal() {
  const { settingsState, handleCallEMS, handleCancelEMS } = useSettingsContext();
  const [evaluatedVitals, setEvaluatedVitals] = useState(settingsState.vitals);

  useEffect(() => {
    if (settingsState.emsModalOpen) {
      setEvaluatedVitals(settingsState.vitals);
      console.log("Modal opened — captured vitals:", settingsState.vitals);
    }
  }, [settingsState.emsModalOpen]);

  if (!settingsState.emsModalOpen) return null;

  const { skinTemp, pulse, spO2 } = evaluatedVitals;

  const isAbnormal =
    skinTemp < 95 || skinTemp > 105 ||
    pulse < 30 || pulse > 220 ||
    spO2 <= 90;

  const title = isAbnormal ? "Emergency Activation" : "Confirm EMS Call";
  const message = isAbnormal
    ? "Critical vitals detected. Do you want to call an EMS dispatcher?"
    : "Vitals are currently stable. Are you sure you want to call 911?";

  const autoCallMessage = isAbnormal
    ? "Automatically calling in 60 seconds if no action is taken."
    : null;



  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ems-modal-title"
      aria-describedby="ems-modal-description"
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 id="ems-modal-title" className="text-lg font-semibold mb-2">
          {title}
        </h2>
        <p id="ems-modal-description" className="mb-4">
          {message}
        </p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleCancelEMS}
            className="text-black bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleCallEMS}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md"
          >
            Call EMS
          </button>
        </div>
        {autoCallMessage && (
          <p className="text-xs text-gray-600 mt-4 text-center" aria-live="assertive">
            {autoCallMessage}
          </p>
		)}
      </div>
    </div>
  );
}


function App() {
const { user } = useAuthenticator();
  const navigate = useNavigate();

  useEffect(() => {
  const checkProfile = async () => {
    
     if (!user?.signInDetails?.loginId) {
        console.warn("User not ready yet");
        return;
     }
     const userID = user.signInDetails?.loginId;
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
    if (!idToken) {
          console.error("No ID token available");
          return;
        }
      const res = await fetch(`https://lesiun05ul.execute-api.us-east-1.amazonaws.com/demo/get-profile?userID=${encodeURIComponent(userID)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`, // 🔐 add this
        },
      });
      if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
      const data = await res.json();

       if (!data || !data.firstName) {
    console.warn("Missing profile data");
    navigate("/complete-registration");
    return;
  }

      const isComplete =
        data.firstName &&
        data.lastName &&
        data.phoneNumber &&
        data.relationship &&
        data.height &&
        data.weight;

      if (!isComplete) {
        navigate("/complete-registration");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      navigate("/complete-registration"); // fallback if error
    }
  };

  checkProfile();
}, [user]);

  return (
    <SettingsProvider>
      <main>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/settings" element={<Settings />} />
<Route path="/complete-registration" element={<CompleteRegistration />} />
            </Routes>
          </div>
          <NavBar />
          <EMSModal />
        </div>
      </main>
    </SettingsProvider>
  );
}

export default App;
