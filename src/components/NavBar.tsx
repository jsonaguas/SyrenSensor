import { NavLink } from 'react-router-dom';
import { IoPersonCircleOutline, IoSettingsOutline, IoCallOutline, IoLogOutOutline } from 'react-icons/io5';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useSettingsContext } from '../context/SettingsContext'; // ✅ import global context

export default function NavBar() {
  const { signOut } = useAuthenticator();
  const { setSettingsState } = useSettingsContext(); // ✅ use context setter

  return (
    <nav role="navigation" aria-label="footer nav bar" className="fixed bottom-0 left-0 w-full bg-[#2b2b2c] text-white z-40 overflow-x-auto">
      <div className="flex justify-between items-center flex-nowrap px-2 py-2 sm:gap-x-4 sm:px-4 sm:py-3">
          <NavLink
            to="/dashboard"
            aria-label="Patient Dashboard"
            className={({ isActive }) =>
              `flex items-center  ${isActive ? 'text-emerald-700' : 'text-white hover:text-emerald-500'}`
            }
          >
            <IoPersonCircleOutline size={24} aria-hidden="true" />
            <span className='text-xs sm:text-sm ml-1'>Dashboard</span>
          </NavLink>

          <NavLink
            to="/settings"
            aria-label="Settings page"
            className={({ isActive }) =>
              `flex items-center ${isActive ? 'text-emerald-700' : 'text-white hover:text-emerald-500'}`
            }
          >
            <IoSettingsOutline size={24} aria-hidden="true" />
            <span className='ml-1 text-xs sm:text-sm'>Settings</span>
          </NavLink>

          {/* ✅ Replace local modal with global EMS modal trigger */}
          <button
            onClick={() =>
              setSettingsState((prev) => ({
                ...prev,
                emsModalOpen: true,
                emsTriggeredManually: true,
              }))
            }
            className="flex items-center text-white bg-red-600 hover:bg-red-700 px-2 py-2 sm:px-4 sm:py-2 rounded-lg"
            aria-label="Open EMS confirmation dialog box"
            aria-haspopup="dialog"
          >
            <IoCallOutline size={24} aria-hidden="true" />
            <span className='ml-1 text-xs sm:text-sm'>Call EMS</span>
          </button>

          {/* ✅ Sign Out Button */}
          <button
            onClick={signOut}
            className="flex items-center px-2 py-2 sm:px-4 sm:py-2 rounded-lg text-white hover:text-emerald-500"
            aria-label="Sign out of account"
          >
            <IoLogOutOutline size={24} aria-hidden="true" />
            <span className="ml-1 text-xs sm:text-sm">Sign Out</span>
          </button>
      </div>
    </nav>
  );
}
