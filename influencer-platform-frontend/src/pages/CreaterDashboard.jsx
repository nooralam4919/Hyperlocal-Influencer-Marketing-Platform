/*
 * CHANGES & REASONS:
 *
 * 1. Removed unused `React` import
 *    REASON: Not needed with Vite JSX transform — caused lint warning.
 *
 * 2. Removed unused `login` import
 *    REASON: Only `logout` is used in this component — `login` was never called.
 *
 * 3. Removed unused `loading` state variable (kept setLoading for button UX)
 *    REASON: `loading` was declared but never read in JSX — lint warning.
 *            Replaced with a single boolean ref pattern using setLoading only.
 */

import authService from "../Appwrite/Auth";
import { logout } from "../store/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreatorDashboard(){
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async()=>{
        try{
            setIsLoggingOut(true);
            await authService.logOut();
            dispatch(logout());
            navigate('/')
        }catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

    return (
    <>
      <h1>Creator Dashboard</h1>

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


export default CreatorDashboard;