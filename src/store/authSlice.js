import { createSlice } from "@reduxjs/toolkit";
import { toPublicUser } from "../utils/authUser";

const initialState = {
  status: false,
  accessToken: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const user = toPublicUser(action.payload?.user);
      state.accessToken = action.payload?.accessToken ?? null;
      state.user = user;
      state.status = Boolean(state.accessToken && user);
    },
    logout: (state) => {
      state.status = false;
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
