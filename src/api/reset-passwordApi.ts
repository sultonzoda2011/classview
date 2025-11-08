import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from './api'
export const resetPasswordApi = createAsyncThunk(
  'Account/reset-password',
  async (data: {
    phoneOrUserName: string
    token: string
    newPassword: string
    confirmNewPassword: string
  }) => {
    try {
      const response = await axios.post(`${API_URL}/Account/reset-password`, data)
      return response.data
    } catch (error) {
      console.log(error)
    }
  },
)
