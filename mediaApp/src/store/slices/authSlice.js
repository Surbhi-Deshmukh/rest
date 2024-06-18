import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firebase from '../../firebase';

export const register = createAsyncThunk('auth/register', async ({ email, password }) => {
  const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
  return userCredential.user;
});

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
  return userCredential.user;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    }
  },
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.status = 'succeeded';
    },
    [login.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.status = 'succeeded';
    },
    [register.rejected]: (state, action) => {
      state.error = action.error.message;
      state.status = 'failed';
    },
    [login.rejected]: (state, action) => {
      state.error = action.error.message;
      state.status = 'failed';
    },
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
