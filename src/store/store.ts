import { configureStore } from '@reduxjs/toolkit'
import centerSlice from './slices/centerSlice'
import classroomSlice from './slices/classRoomSlice'
import streamSlice from './slices/streamSlice'
import usersSlice from './slices/usersSlice'
export const store = configureStore({
  reducer: {
    center: centerSlice,
    classRoom: classroomSlice,
    stream: streamSlice,
    users: usersSlice,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
