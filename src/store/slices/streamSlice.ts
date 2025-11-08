import { createSlice } from '@reduxjs/toolkit'
import type { IStreamState } from '../../types/stream'
import { getStreamsAdmin, getStreamsUser } from '../../api/streamApi'

const initialState: IStreamState = {
  stream: {
    statusCode: 0,
    data: '',
    message: '',
  },
}

const streamSlice = createSlice({
  name: 'stream',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStreamsAdmin.fulfilled, (state, action) => {
      state.stream = action.payload || {}
    })
    builder.addCase(getStreamsUser.fulfilled, (state, action) => {
      state.stream = action.payload || {}
    })
  },
})

export default streamSlice.reducer
