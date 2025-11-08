import { createSlice } from '@reduxjs/toolkit'
import type { ICenterState } from '../../types/center'
import { getCenters } from '../../api/centerApi'

const initialState: ICenterState = {
  centers: [],
}

const centerSlice = createSlice({
  name: 'center',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCenters.fulfilled, (state, action) => {
      state.centers = action.payload || []
    })
  },
})
export default centerSlice.reducer

