import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export const fetchHeroInfo = createAsyncThunk(
  'hero/fetchHeroInfo',
  async () => {
    const res = await fetch(`${API_BASE}/api/hero`)
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return res.json()
  },
)

const heroInfo = createSlice({
  name: 'hero-info',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroInfo.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchHeroInfo.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchHeroInfo.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default heroInfo.reducer
