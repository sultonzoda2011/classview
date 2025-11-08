import { API_URL } from './api'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'
import type { IChangePassword, ICreateEmployee, ICreateUser, IUpdateUser } from '../types/users'
export const getUsers = createAsyncThunk('users/getUsers', async () => {
  try {
    const response = await axios.get(`${API_URL}/Users`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
    return response.data.data
  } catch (error) {
    console.log(error)
  }
})
export const getUserById = createAsyncThunk('users/getUserById', async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/Users/${id}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
    return response.data.data
  } catch (error) {
    console.log(error)
  }
})
export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string, { dispatch }) => {
  try {
    await axios.delete(`${API_URL}/Users/${id}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
    dispatch(getUsers())
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error)
  }
})
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (data: IUpdateUser, { dispatch }) => {
    try {
      await axios.put(`${API_URL}/Users/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      dispatch(getUsers())
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error)
    }
  },
)

export const createUser = createAsyncThunk(
  'users/createUser',
  async (data: ICreateUser, { dispatch }) => {
    try {
      await axios.post(`${API_URL}/Users`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      dispatch(getUsers())
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error)
    }
  },
)

export const createEmployee = createAsyncThunk(
  'users/createEmploy',
  async (data: ICreateEmployee, { dispatch }) => {
    try {
      await axios.post(`${API_URL}/Users/create-employee`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      dispatch(getUsers())
    } catch (error) {
      console.error('Ошибка при создании сотрудника:', error)
    }
  },
)

export const changePassword = createAsyncThunk(
  'users/changePassword',
  async (data: IChangePassword, { dispatch }) => {
    try {
      await axios.post(`${API_URL}/Account/change-password`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      dispatch(getUsers())
    } catch (error) {
      console.error('Ошибка при изменении пароля:', error)
    }
  },
)
