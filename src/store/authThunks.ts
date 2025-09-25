// src/store/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

// ---- Types ----
interface SigninPayload {
  email: string;
  password: string;
}
interface RegisterPayload {
  email: string;
  password: string;
}
interface VerifyOtpPayload {
  accountId: string;
  otp: string;
}

// ---- SIGN IN ----
export const signinThunk = createAsyncThunk(
  "auth/signin",
  async ({ email, password }: SigninPayload, thunkAPI) => {
    try {
      const res = await api.post("/account/signin", { email, password });
      return res.data; // expect { account, tokens?, message }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Sign in failed");
    }
  }
);

// ---- REGISTER ----
export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ email, password }: RegisterPayload, thunkAPI) => {
    try {
      const res = await api.post("/account/register", { email, password });

      // Save accountId in localStorage for OTP verification
      if (res.data?.accountId) {
        localStorage.setItem("pendingAccountId", res.data.accountId);
      }

      return res.data; // { accountId, otpSuccess, role, accountType }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ---- VERIFY EMAIL OTP ----
export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async ({ accountId, otp }: VerifyOtpPayload, thunkAPI) => {
    try {
      const res = await api.post("/account/verify-otp", { accountId, otp });
      return res.data; // expect { success, message }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "OTP verification failed");
    }
  }
);

// ---- REFRESH TOKEN ----
export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const res = await api.post("/account/refresh");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Unable to refresh token");
    }
  }
);

// ---- LOGOUT ----
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const res = await api.post("/account/logout");
      return res.data; // { message }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || "Logout failed");
    }
  }
);
