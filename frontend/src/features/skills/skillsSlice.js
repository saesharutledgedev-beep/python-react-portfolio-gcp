import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async () => {
    const res = await fetch(`${API_BASE}/api/skills`)
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return res.json()
  },
)

const skills = createSlice({
  name: 'skills',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default skills.reducer
