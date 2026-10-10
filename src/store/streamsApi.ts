import { api } from './api'

export const streamsApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** Родитель: ссылка на поток своего класса (сервер проверяет connect и окно времени) */
    getMyStream: build.query<string, void>({
      query: () => ({ url: '/Streams/playlist.m3u8' }),
    }),
    /** Admin/SuperAdmin: ссылка на поток конкретного класса */
    getClassRoomStream: build.query<string, number>({
      query: (classRoomId) => ({ url: `/Streams/${classRoomId}/playlist.m3u8` }),
    }),
  }),
})

export const { useLazyGetMyStreamQuery, useLazyGetClassRoomStreamQuery } = streamsApi
