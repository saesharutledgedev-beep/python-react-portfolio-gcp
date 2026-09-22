import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const res = await fetch(`${API_BASE}/api/projects`)
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return res.json()
  },
)

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default projectsSlice.reducer
