import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    settings: {
      captureSysAudio: true,
    },
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.user = {
        id: action.payload.id,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        email: action.payload.email,
        image: action.payload.image,
      };
    },
    clearUser: (state) => {
      state.user = null;
    },
    toggleSysAudio: (state) => {
      state.settings.captureSysAudio = !state.settings.captureSysAudio;
    },
  },
});

export const { setUserDetails, clearUser, toggleSysAudio } = userSlice.actions;

export default userSlice.reducer;
