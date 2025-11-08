import { createSlice } from '@reduxjs/toolkit'
import type { IUserState } from '../../types/users'
import { getUserById, getUsers } from '../../api/usersApi'

const initialState: IUserState = {
  users: [],
  usersById: {
    id: '',
    fullName: '',
    childName: '',
    phoneNumber: '',
    connect: false,
    createdAt: '',
    startTime: '',
    endTime: '',
    classRoomId: 0,
    centerId: 0,
  },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.users = action.payload || []
    })
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.usersById = action.payload || initialState.usersById
    })
  },
})
// export const {} = userSlice.actions
export default userSlice.reducer
