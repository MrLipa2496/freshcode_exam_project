import {
  addEvent,
  deleteEvent,
  clearEvents,
  updateEvents,
  markNotificationsAsViewed,
} from '../store/slices/eventsSlice';
import CONSTANTS from '../constants';

const eventsLocalStorageMiddleware = store => next => action => {
  const result = next(action);

  const { events, viewedNotifications } = store.getState().eventsStore;

  switch (action.type) {
    case addEvent.type:
    case deleteEvent.type:
    case clearEvents.type:
    case updateEvents.type:
      localStorage.setItem(
        CONSTANTS.EVENTS_STORAGE_KEY,
        JSON.stringify(events)
      );
      break;

    case markNotificationsAsViewed.type:
      localStorage.setItem(
        CONSTANTS.VIEWED_NOTIFICATIONS_KEY,
        JSON.stringify(viewedNotifications)
      );
      break;

    default:
      break;
  }

  return result;
};

export default eventsLocalStorageMiddleware;
