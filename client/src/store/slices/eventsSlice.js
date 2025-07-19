import { createSlice } from '@reduxjs/toolkit';
import CONSTANTS from '../../constants';

const getEventsKey = userId => `${CONSTANTS.EVENTS_STORAGE_KEY}_${userId}`;
const getViewedKey = userId =>
  ` ${CONSTANTS.VIEWED_NOTIFICATIONS_KEY}_${userId}`;

const loadEventsFromLocalStorage = userId => {
  if (!userId) return [];
  const events = localStorage.getItem(getEventsKey(userId));
  const parsed = events ? JSON.parse(events) : [];
  return parsed;
};

const loadViewedNotificationsFromLocalStorage = userId => {
  if (!userId) return [];
  const viewed = localStorage.getItem(getViewedKey(userId));
  return viewed ? JSON.parse(viewed) : [];
};

const saveEventsToLocalStorage = (userId, events) => {
  if (!userId) return;
  localStorage.setItem(getEventsKey(userId), JSON.stringify(events));
};

const saveViewedToLocalStorage = (userId, viewed) => {
  if (!userId) return;
  localStorage.setItem(getViewedKey(userId), JSON.stringify(viewed));
};

const eventsSlice = createSlice({
  name: CONSTANTS.EVENTS_STORAGE_KEY,
  initialState: {
    currentUserId: null,
    events: [],
    viewedNotifications: [],
  },
  reducers: {
    setCurrentUser (state, action) {
      const userId = action.payload;
      state.currentUserId = userId;
      state.events = loadEventsFromLocalStorage(userId);
      state.viewedNotifications =
        loadViewedNotificationsFromLocalStorage(userId);
    },

    addEvent (state, action) {
      const userId = state.currentUserId;
      if (!userId) {
        console.warn('Unable to add event: currentUserId not set');
        return;
      }

      const newEvent = { ...action.payload, completed: false };
      state.events.push(newEvent);
      saveEventsToLocalStorage(userId, state.events);
    },

    deleteEvent (state, action) {
      const userId = state.currentUserId;
      if (!userId) return;

      state.events = state.events.filter(event => event.id !== action.payload);
      saveEventsToLocalStorage(userId, state.events);
    },

    clearEvents (state) {
      const userId = state.currentUserId;
      if (!userId) return;

      state.events = [];
      saveEventsToLocalStorage(userId, []);
    },

    markNotificationsAsViewed (state) {
      const userId = state.currentUserId;
      if (!userId) return;

      state.viewedNotifications = [
        ...new Set([
          ...state.viewedNotifications,
          ...state.events.map(event => event.id),
        ]),
      ];
      saveViewedToLocalStorage(userId, state.viewedNotifications);
    },

    updateEvents (state) {
      const userId = state.currentUserId;
      if (!userId) return;

      const now = Date.now();
      state.events = state.events.map(event => {
        const timeLeft = event.eventTimestamp - now;
        if (timeLeft <= 0 && !event.completed) {
          return { ...event, completed: true };
        }
        return event;
      });

      saveEventsToLocalStorage(userId, state.events);
    },
  },
});

export const {
  setCurrentUser,
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
