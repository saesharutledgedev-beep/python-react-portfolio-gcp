import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export const fetchAboutInfo = createAsyncThunk(
  'about/fetchAboutInfo',
  async () => {
    const res = await fetch(`${API_BASE}/api/about`)
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return res.json()
  },
)

const aboutInfo = createSlice({
  name: 'about-info',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutInfo.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAboutInfo.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchAboutInfo.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default aboutInfo.reducer
