import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './reducers/pollReducer';
import userReducer from './reducers/userReducer';

export const store = configureStore({
  reducer: {
    poll: pollReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['poll/setCurrentPoll', 'poll/setPollResults'],
        ignoredPaths: ['poll.currentPoll.createdAt', 'poll.results.createdAt'],
      },
    }),
});