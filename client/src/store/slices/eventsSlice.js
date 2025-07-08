import { createSlice } from '@reduxjs/toolkit';
import CONSTANTS from '../../constants';

const loadEventsFromLocalStorage = () => {
  const events = localStorage.getItem(CONSTANTS.EVENTS_STORAGE_KEY);
  return events ? JSON.parse(events) : [];
};

const loadViewedNotificationsFromLocalStorage = () => {
  const viewedNotifications = localStorage.getItem(
    CONSTANTS.VIEWED_NOTIFICATIONS_KEY
  );
  return viewedNotifications ? JSON.parse(viewedNotifications) : [];
};

const eventsSlice = createSlice({
  name: CONSTANTS.EVENTS_STORAGE_KEY,
  initialState: {
    events: loadEventsFromLocalStorage(),
    viewedNotifications: loadViewedNotificationsFromLocalStorage(),
  },
  reducers: {
    addEvent (state, action) {
      const newEvent = { ...action.payload, completed: false };
      state.events.push(newEvent);
    },
    deleteEvent (state, action) {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    clearEvents (state) {
      state.events = [];
    },
    markNotificationsAsViewed (state) {
      state.viewedNotifications = [
        ...new Set([
          ...state.viewedNotifications,
          ...state.events.map(event => event.id),
        ]),
      ];
    },
    updateEvents (state) {
      const now = Date.now();
      state.events = state.events.map(event => {
        const timeLeft = event.eventTimestamp - now;
        if (timeLeft <= 0 && !event.completed) {
          return { ...event, completed: true };
        }
        return event;
      });
    },
  },
});

export const {
  addEvent,
  deleteEvent,
  clearEvents,
  markNotificationsAsViewed,
  updateEvents,
} = eventsSlice.actions;

export const selectActiveNotifications = state => {
  const now = Date.now();
  const { events, viewedNotifications } = state.eventsStore;

  return events.filter(event => {
    const timeLeft = event.eventTimestamp - now;
    const notifyTime = event.notificationTime * 60 * 1000;

    return (
      !viewedNotifications.includes(event.id) &&
      (timeLeft <= notifyTime || timeLeft <= 0)
    );
  }).length;
};

export default eventsSlice.reducer;
