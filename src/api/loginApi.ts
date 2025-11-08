import { createAsyncThunk } from '@reduxjs/toolkit'
import Cookie from 'js-cookie'
import axios from 'axios'
import { API_URL } from './api'
import type { ILogin } from '../types/login'

export const loginApi = createAsyncThunk('Account/login', async (data: ILogin) => {
  try {
    const response = await axios.post(`${API_URL}/Account/login`, data)
    Cookie.set('token', response.data.data)
    return response.data
  } catch (error) {
    console.error('Error during login:', error)
    throw new Error('Ошибка при выполнении запроса');
  }
})
