import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { User } from "../models/User";
import { Vitals } from "../models/Vitals";

interface SettingsState {
  user: User;
  emergencyContact: any;
  bluetoothDevice: any;
  vitals: Vitals;
  emsModalOpen: boolean;
  emsTriggeredManually: boolean;
}

interface SettingsContextType {
  settingsState: SettingsState;
  setSettingsState: React.Dispatch<React.SetStateAction<SettingsState>>;
  updateUser: (user: User) => void;
  updateEmergencyContact: (contact: any) => void;
  updateBluetoothDevice: (device: any) => void;
  updateVitals: (vitals: Vitals) => void;
  handleCallEMS: () => void;
  handleCancelEMS: () => void;
}

const defaultState: SettingsState = {
  user: {
    userId: 0,
    name: "",
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
    skinTemp: 98,
    pulse: 70,
    spO2: 100,
  },
  emsModalOpen: false,
  emsTriggeredManually: false,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settingsState, setSettingsState] = useState<SettingsState>(defaultState);
  const [emsTimeoutId, setEmsTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();

  const updateUser = (updatedUser: User) => {
    setSettingsState((prevState) => ({
      ...prevState,
      user: updatedUser,
    }));
  };

  const updateEmergencyContact = (updatedContact: any) => {
    setSettingsState((prevState) => ({
      ...prevState,
      emergencyContact: updatedContact,
    }));
  };

  const updateBluetoothDevice = (updatedDevice: any) => {
    setSettingsState((prevState) => ({
      ...prevState,
      bluetoothDevice: updatedDevice,
    }));
  };

  const updateVitals = (updatedVitals: Vitals) => {
    setSettingsState((prevState) => ({
      ...prevState,
      vitals: updatedVitals,
    }));
  };

  const handleCallEMS = () => {
    setSettingsState((prev) => ({
      ...prev,
      emsModalOpen: false,
      emsTriggeredManually: false,
    }));
    window.location.href = "tel:+15551234567";
  };

  const handleCancelEMS = () => {
    setSettingsState((prev) => ({
      ...prev,
      emsModalOpen: false,
      emsTriggeredManually: false,
    }));
    if (emsTimeoutId) {
      clearTimeout(emsTimeoutId);
      setEmsTimeoutId(null);
    }
  };

  useEffect(() => {
    const { skinTemp, pulse, spO2 } = settingsState.vitals;
    const shouldCallEMS =
      skinTemp < 95 || skinTemp > 105 || spO2 <= 90 || pulse < 30 || pulse > 220;

    if (shouldCallEMS && !settingsState.emsModalOpen) {
      setSettingsState((prev) => ({ ...prev, emsModalOpen: true }));
      const timeout = setTimeout(() => {
        handleCallEMS();
      }, 60000);
      setEmsTimeoutId(timeout);
    }

    if (!shouldCallEMS && settingsState.emsModalOpen) {
      handleCancelEMS();
    }

    return () => {
      if (emsTimeoutId) {
        clearTimeout(emsTimeoutId);
        setEmsTimeoutId(null);
      }
    };
  }, [settingsState.vitals, location.pathname]);

  return (
    <SettingsContext.Provider
      value={{
        settingsState,
        setSettingsState,
        updateUser,
        updateEmergencyContact,
        updateBluetoothDevice,
        updateVitals,
        handleCallEMS,
        handleCancelEMS,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return context;
};