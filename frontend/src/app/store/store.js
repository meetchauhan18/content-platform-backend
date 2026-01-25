// libs imports
import { configureStore } from "@reduxjs/toolkit";

// local imports
import authReducer from "@/features/auth/auth.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: import.meta.env.DEV,
});
