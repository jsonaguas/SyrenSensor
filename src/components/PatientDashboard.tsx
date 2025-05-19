// import { useEffect, useState } from "react";
// import { User } from "../models/User";
import { useSettingsContext } from "../context/SettingsContext";
import syrenLogo from '../assets/syrensensor2.png'
import VitalsCard from "./VitalsCard";

export default function PatientDashboard() {
  const { settingsState } = useSettingsContext();
  console.log("🧠 Dashboard render → name is:", settingsState.user.name);

  return (
    <div aria-labelledby='dashboard-title' className="flex-1 bg-[#2b2b2c] min-h-screen overflow-y-auto px-4 py-6 mb-10">
      <div className="flex flex-col items-center justify-start">
        <h1 id='dashboard-title' className='sr-only'>Syren Sensor</h1>
        <img className='w-60 h-60 mb-6 mx-auto bg-[#2b2b2c]' alt="Syren Sensor Logo" src={syrenLogo}/> 
        <div  className="w-10/12 sm:w-8/12 md:w-6/12 lg:w-3/12 text-justified bg-black rounded-2xl border border-blue-500 shadow-lg px-10 py-10 mx-auto mb-10">
          <div aria-labelledby="patient-info-title">
            <h3 id='patient-info-title' className="text-white text-lg font-semibold mb-2">Patient Info:</h3>

            <p className="text-white mb-3 capitalize">
              <span className="font-semibold">Name:</span>{" "}
              <span className="font-normal">{settingsState.user.name}</span>
              
            </p>
            <p className="text-white mb-3 capitalize">
              <span className="font-semibold">Age:</span>{" "}
              <span className="font-normal">{settingsState.user.age}</span>
            </p>
            <p className="text-white mb-3 capitalize">
              <span className="font-semibold">Gender:</span>{" "}
              <span className="font-normal">{settingsState.user.gender}</span>
            </p>
            <p className="text-white mb-3 capitalize">
              <span className="font-semibold">Height:</span>{" "}
              <span className="font-normal">{settingsState.user.height}</span>
            </p>
            <p className="text-white mb-3 capitalize">
              <span className="font-semibold">Weight:</span>{" "}
              <span className="font-normal">{settingsState.user.weight}</span>
            </p>
            </div>
          <div aria-labelledby="vitals-title" aria-live='polite'>
            <VitalsCard />

          </div>
        </div>
      </div>
    </div>
  );
}
