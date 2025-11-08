import { API_URL } from './api'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
export const verifyOtpApi = createAsyncThunk(
  'Account/verify-otp',
  async (data: { phoneNumber: string; otpCode: string }) => {
    try {
      const response = await axios.post(`${API_URL}/Account/verify-otp`, data)
      localStorage.setItem('token', response.data.data)
      return response.data
    } catch (error) {
      console.log(error)
    }
  },
)
