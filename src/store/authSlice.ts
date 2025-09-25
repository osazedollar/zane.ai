import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  signinThunk,
  registerThunk,
  verifyOtpThunk,
  refreshTokenThunk,
  logoutThunk,
} from "./authThunks";

interface Account {
  accountId: string;
  email: string;
  role: string;
  isVerified: boolean;
  accountType: string;
}

interface AuthState {
  account: Account | null;
  loading: boolean;
  error: string | null;
  otpSuccess: boolean;
  isRegistered: boolean;
}

const initialState: AuthState = {
  account: null,
  loading: false,
  error: null,
  otpSuccess: false,
  isRegistered: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.account = null;
      state.isRegistered = false;
      state.otpSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- Signin ---
    builder
      .addCase(signinThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinThunk.fulfilled, (state, action: PayloadAction<Account>) => {
        state.loading = false;
        state.account = action.payload;
      })
      .addCase(signinThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- Register ---
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
        state.isRegistered = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- Verify OTP ---
    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.loading = false;
        state.otpSuccess = true;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- Refresh Token ---
    builder.addCase(refreshTokenThunk.rejected, (state) => {
      state.account = null;
    });

    // --- Logout ---
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.account = null;
    });
  },
});

export const { logoutLocal } = authSlice.actions;
export default authSlice.reducer;
