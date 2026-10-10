import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../api/baseQuery'

/** Единый root api: все сущности подключаются через injectEndpoints в своих файлах. */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Center', 'ClassRoom', 'User', 'Me'],
  endpoints: () => ({}),
})
