import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from './api'
import Cookies from 'js-cookie'
import type { ICreateCenter, IUpdateCenter } from '../types/center'
export const getCenters = createAsyncThunk('center/getCenters', async () => {
  try {
    const response = await axios.get(`${API_URL}/Centers`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })

    return response.data.data
  } catch (error) {
    console.log('Ошибка при получении центров:', error)
  }
})

export const deleteCenter = createAsyncThunk(
  'center/deleteCenter',
  async (id: number, { dispatch }) => {
    try {
      const response = await axios.delete(`${API_URL}/Centers/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      console.log('Удаление центра:', response.data)
      dispatch(getCenters())
    } catch (error) {
      console.error('Ошибка при удалении центра:', error)
    }
  },
)

export const updateCenter = createAsyncThunk(
  'center/updateCenter',
  async (data: IUpdateCenter, { dispatch }) => {
    try {
      const response = await axios.put(`${API_URL}/Centers/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      console.log('Обновление центра:', response.data)
      dispatch(getCenters())
    } catch (error) {
      console.error('Ошибка при обновлении центра:', error)
    }
  },
)

export const createCenter = createAsyncThunk(
  'center/createCenter',
  async (data: ICreateCenter, { dispatch }) => {
    try {
      const response = await axios.post(`${API_URL}/Centers`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      console.log('Создание центра:', response.data)
      dispatch(getCenters())
    } catch (error) {
      console.error('Ошибка при создании центра:', error)
    }
  },
)
