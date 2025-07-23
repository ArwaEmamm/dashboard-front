import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Announcement = {
  _id: string;
  title: string;
  description: string;
  createdBy?: string;
  createdAt?: string;
};

interface AnnouncementsState {
  items: Announcement[];
}

const initialState: AnnouncementsState = {
  items: [],
};

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setAnnouncements(state, action: PayloadAction<Announcement[]>) {
      state.items = action.payload;
    },
    addAnnouncement(state, action: PayloadAction<Announcement>) {
      state.items = [action.payload, ...state.items];
    },
    deleteAnnouncement(state, action: PayloadAction<string>) {
      state.items = state.items.filter(a => a._id !== action.payload);
    },
    clearAnnouncements(state) {
      state.items = [];
    },
  },
});

export const { setAnnouncements, addAnnouncement, deleteAnnouncement, clearAnnouncements } = announcementsSlice.actions;
export default announcementsSlice.reducer;
