import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userType: null,
  name: '',
  hasAnswered: false,
  currentAnswer: null,
  answerTime: null,
  isConnected: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    setCurrentAnswer: (state, action) => {
      state.currentAnswer = action.payload;
    },
    setAnswerTime: (state, action) => {
      state.answerTime = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    resetUser: (state) => {
      return initialState;
    }
  },
});

export const { 
  setUserType, 
  setName, 
  setAnswered, 
  setCurrentAnswer, 
  setAnswerTime,
  setConnected,
  resetUser 
} = userSlice.actions;

export default userSlice.reducer;