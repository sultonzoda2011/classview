import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from './api'
import Cookies from 'js-cookie'

export const getStreamsAdmin = createAsyncThunk('stream/getStreamsAdmin', async (classRoomId: number) => {
  try {
    const response = await axios.get(`${API_URL}/Streams/${classRoomId}/playlist.m3u8`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
})
export const getStreamsUser = createAsyncThunk('stream/getStreamsUser', async ( ) => {
  try {
    const response = await axios.get(`${API_URL}/Streams/playlist.m3u8`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
})
