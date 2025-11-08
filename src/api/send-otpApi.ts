import { createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from './api'
import axios from 'axios'
export const sendOtpApi = createAsyncThunk(
  'Account/send-otp',
  async (data: { phoneNumber: string }) => {
    try {
      const response = await axios.post(`${API_URL}/Account/send-otp`, data)
      localStorage.setItem('phoneNumber', data.phoneNumber)
      return response.data
    } catch (error) {
      console.log(error)
    }
  },
)
