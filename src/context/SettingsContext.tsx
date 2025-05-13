import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../models/User";
import { Vitals } from "../models/vitals";

// Define the initial structure of the settings state
interface SettingsState {
  user: User;
  emergencyContact: any;
  bluetoothDevice: any;
  vitals: Vitals;
}

// Initialize the default state structure
const defaultState: SettingsState = {
  user: {
    userId: 0,
    name: { firstName: "", lastName: "" },
    age: 0,
    gender: null,
    height: "",
    weight: "",
    phoneNumber: "",
    primaryAddress: {
      buildingNumber: "",
      street: "",
      aptUnitNumber: "",
      zipCode: "",
      city: "",
      state: "",
      country: "",
    },
  },
  emergencyContact: {
    contactId: 0,
    userId: 0,
    name: { firstName: "", lastName: "" },
    phoneNumber: "",
    relationship: "",
  },
  bluetoothDevice: {
    deviceId: 0,
    serialNumber: "",
    deviceMake: "",
    deviceModel: "",
  },
  vitals: {
    vitalsId: 0,
    skinTemp: 0,
    pulse: 0,
    spO2: 0,
  },
};

// Create context with default value
const SettingsContext = createContext<SettingsState | any>(defaultState);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settingsState, setSettingsState] = useState<SettingsState>(defaultState);

  // Function to update user data
  const updateUser = (updatedUser: User) => {
    setSettingsState((prevState: SettingsState) => ({
      ...prevState,
      user: updatedUser,
    }));
  };

  // Function to update emergency contact data
  const updateEmergencyContact = (updatedContact: any) => {
    setSettingsState((prevState: SettingsState) => ({
      ...prevState,
      emergencyContact: updatedContact,
    }));
  };

  // Function to update bluetooth device data
  const updateBluetoothDevice = (updatedDevice: any) => {
    setSettingsState((prevState: SettingsState) => ({
      ...prevState,
      bluetoothDevice: updatedDevice,
    }));
  };

  // Function to update vitals data
  const updateVitals = (updatedVitals: any) => {
    setSettingsState((prevState: SettingsState) => ({
      ...prevState,
      vitals: updatedVitals,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settingsState,
        updateUser,
        updateEmergencyContact,
        updateBluetoothDevice,
        updateVitals,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettingsContext = () => useContext(SettingsContext);
