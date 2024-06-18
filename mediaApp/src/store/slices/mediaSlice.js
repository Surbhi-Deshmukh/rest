import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadMedia = createAsyncThunk('media/upload', async ({ userId, media, fileType }) => {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('media', media);
  formData.append('fileType', fileType);

  const response = await axios.post('http://localhost:5000/api/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.media;
});

export const fetchMedia = createAsyncThunk('media/fetch', async (userId) => {
  const response = await axios.get(`http://localhost:5000/api/media/${userId}`);
  return response.data.media;
});

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    media: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: {
    [uploadMedia.fulfilled]: (state, action) => {
      state.media.push(action.payload);
      state.status = 'succeeded';
    },
    [fetchMedia.fulfilled]: (state, action) => {
      state.media = action.payload;
      state.status = 'succeeded';
    },
    [uploadMedia.rejected]: (state, action) => {
      state.error = action.error.message;
      state.status = 'failed';
    },
    [fetchMedia.rejected]: (state, action) => {
      state.error = action.error.message;
      state.status = 'failed';
    },
  }
});

export default mediaSlice.reducer;
