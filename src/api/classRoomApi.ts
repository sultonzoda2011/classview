import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from './api'
import Cookies from 'js-cookie'
import type { ICreateClassRoom, IUpdateClassRoom } from '../types/classRoom'
export const getClassrooms = createAsyncThunk('classroom/getClassrooms', async () => {
  try {
    const response = await axios.get(`${API_URL}/ClassRooms`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
    return response.data.data
  } catch (error) {
    console.log(error)
  }
})
export const deleteClassrooms = createAsyncThunk(
  'classroom/deleteClassroom',
  async (id: number, { dispatch }) => {
    try {
      await axios.delete(`${API_URL}/ClassRooms/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      console.log('Удаление класса:')
      dispatch(getClassrooms())
    } catch (error) {
      console.error('Ошибка при удалении класса:', error)
    }
  },
)
export const createClassroom = createAsyncThunk(
  'classroom/createClassroom',
  async (data: ICreateClassRoom, { dispatch }) => {
    try {
      const response = await axios.post(`${API_URL}/ClassRooms`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      console.log('Создание класса:', response.data)
      dispatch(getClassrooms())
    } catch (error) {
      console.error('Ошибка при создании класса:', error)
    }
  },
)
export const updateClassroom = createAsyncThunk(
  'classroom/updateClassroom',
  async (data: IUpdateClassRoom, { dispatch }) => {
    try {
      const response = await axios.put(`${API_URL}/ClassRooms/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      console.log('Обновление класса:', response.data)
      dispatch(getClassrooms())
    } catch (error) {
      console.error('Ошибка при обновлении класса:', error)
    }
  },
)
