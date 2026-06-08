/*
 * CHANGES & REASONS:
 *
 * 1. Fixed variable name: `currentUser` → `userData`
 *    REASON: getCurrentUser() returns `userData` in the .then() callback,
 *            but the dispatch was referencing `currentUser` which is undefined → crash.
 *
 * 2. Fixed typo: `onsole.log` → `console.log`
 *    REASON: Missing 'c' caused a ReferenceError at runtime.
 *
 * 3. Removed unused imports: `Container` import path was correct, kept as is.
 *    REASON: Container component exists and is used correctly.
 */

import Container from "./components/contianer/Container";
import { Outlet } from "react-router-dom";
import authService from "./Appwrite/Auth";
import { login, logout } from "./store/authSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          // FIX 1: was using `currentUser` (undefined) — changed to `userData`
          dispatch(
            login({
              userData: {
                $id: userData.$id,
                name: userData.name,
                email: userData.email,
                prefs: userData.prefs,
              },
              role: userData.prefs?.role,
            }),
          );
        } else {
          // FIX 2: was `onsole.log` (typo) — fixed to `console.log`
          console.log("User logged out");
          dispatch(logout());
        }
      })
      .catch(() => {
        console.log("Auth check failed / logged out");
        dispatch(logout());
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return !loading ? (
      <Outlet />
  ) : null;
}

export default App;
