/*
 * CHANGES & REASONS:
 *
 * 1. Removed unused `Owner_viewpage` import
 *    REASON: Was imported but never used — lint warning.
 *
 * 2. Removed unused `loading` state, replaced with `isLoggingOut`
 *    REASON: `loading` was declared but never read in JSX — lint warning.
 *
 * 3. Fixed logout — now navigates to "/" after logout
 *    REASON: navigate was commented out, so user stayed on dashboard after logout.
 */

import { useDispatch } from "react-redux";
import { useState } from "react";
import authService from "../Appwrite/Auth";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logOut();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <h1>Owner Dashboard</h1>

      <button
        className="p-0.5 h-20 w-20 m-20 bg-amber-500 hover:bg-amber-100 border"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "..." : "LogOut"}
      </button>
    </>
  );
}

export default OwnerDashboard;
