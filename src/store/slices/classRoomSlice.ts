import { createSlice } from '@reduxjs/toolkit'
import type { IClassRoomState } from '../../types/classRoom'
import { getClassrooms } from '../../api/classRoomApi'

const initialState: IClassRoomState = {
  classrooms: [],
}

const classroomSlice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getClassrooms.fulfilled, (state, action) => {
      state.classrooms = action.payload || []
    })
  },
})
export default classroomSlice.reducer
