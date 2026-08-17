import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
