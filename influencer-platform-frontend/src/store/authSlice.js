import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  role: null,
};

const serializeUser = (user) => ({
  $id: user.$id,
  name: user.name,
  email: user.email,
  prefs: user.prefs,
});

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, action) => {

      state.status = true;
      state.userData = serializeUser(action.payload.userData);
      state.role = action.payload.role;
    },

    logout: (state) => {

      state.status = false;
      state.userData = null;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;