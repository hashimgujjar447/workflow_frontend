import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User | null; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.isInitialized = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.isInitialized = true;

      localStorage.removeItem("access"); // ✅ fix
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;