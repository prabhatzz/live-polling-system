import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPoll: null,
  results: null,
  isActive: false,
  messages: [],
  students: [],
  pollHistory: [],
  loading: false,
  error: null
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPoll: (state, action) => {
      state.currentPoll = action.payload;
      state.isActive = action.payload?.isActive || false;
    },
    setPollResults: (state, action) => {
      state.results = action.payload;
      state.isActive = action.payload?.isActive || false;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      if (state.messages.length > 100) {
        state.messages = state.messages.slice(-100);
      }
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    addStudent: (state, action) => {
      const existingIndex = state.students.findIndex(s => s.id === action.payload.id);
      if (existingIndex >= 0) {
        state.students[existingIndex] = action.payload;
      } else {
        state.students.push(action.payload);
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload);
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    clearPoll: (state) => {
      state.currentPoll = null;
      state.results = null;
      state.isActive = false;
    },
    resetPoll: (state) => {
      return initialState;
    }
  },
});

export const { 
  setLoading, 
  setError, 
  clearError,
  setCurrentPoll, 
  setPollResults, 
  addMessage, 
  setMessages,
  setStudents, 
  addStudent, 
  removeStudent,
  setPollHistory,
  clearPoll, 
  resetPoll 
} = pollSlice.actions;

export default pollSlice.reducer;