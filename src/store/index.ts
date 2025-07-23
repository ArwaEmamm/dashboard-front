
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import announcementsReducer from './announcementsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    announcements: announcementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
