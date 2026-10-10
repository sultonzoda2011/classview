import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { clearAuthToken } from '../hooks/useAuth'
import { notify } from '../lib/notify'
import { API_URL } from './env'

export const httpClient = axios.create({ baseURL: API_URL })

httpClient.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

interface ApiEnvelope<T> {
  statusCode: number
  data: T
  message: string
}

/** true для запросов, где 401 ожидаем и не должен разлогинивать (логин, отправка/проверка кода) */
const isAuthEndpoint = (url?: string) => !!url && /^\/?Account\/(login|send-otp|verify-otp|reset-password)/.test(url)

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (message) return message
    return error.response ? `Ошибка ${error.response.status}` : 'Нет связи с сервером'
  }
  return 'Неизвестная ошибка'
}

/**
 * baseQuery для RTK Query поверх axios: разворачивает {statusCode,data,message},
 * централизованно показывает ошибки тостом и разлогинивает по просроченному токену.
 */
export const axiosBaseQuery =
  (): BaseQueryFn<{ url: string; method?: AxiosRequestConfig['method']; data?: unknown; params?: unknown; silent?: boolean }, unknown, { status?: number; message: string }> =>
  async ({ url, method = 'GET', data, params, silent }) => {
    try {
      const result = await httpClient.request<ApiEnvelope<unknown>>({ url, method, data, params })
      return { data: result.data.data, meta: { message: result.data.message } }
    } catch (err) {
      const error = err as AxiosError
      const message = getErrorMessage(error)
      if (error.response?.status === 401 && !isAuthEndpoint(url)) {
        clearAuthToken()
      } else if (!silent) {
        notify.error(message)
      }
      return { error: { status: error.response?.status, message } }
    }
  }
