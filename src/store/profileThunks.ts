// src/store/profileThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

// Fetch current account details
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/account/me");
      return res.data.account;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

