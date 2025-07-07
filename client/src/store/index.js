import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import { initSocket } from '../api/ws/socketController';
import eventsLocalStorageMiddleware from '../middlewares/eventsLocalStorageMiddleware';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(eventsLocalStorageMiddleware),
});

initSocket(store);

export default store;
