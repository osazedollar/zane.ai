// src/store/profileSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile } from "./profileThunks";

interface ProfileState {
  account: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  account: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.account = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.account = null; // ensure it clears if fetch fails
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
