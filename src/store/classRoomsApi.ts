import type { IClassRoom } from '../types/classRoom'
import { api } from './api'

export const classRoomsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getClassRooms: build.query<IClassRoom[], void>({
      query: () => ({ url: '/ClassRooms' }),
      providesTags: (result) =>
        result ? [...result.map((c) => ({ type: 'ClassRoom' as const, id: c.id })), { type: 'ClassRoom', id: 'LIST' }] : [{ type: 'ClassRoom', id: 'LIST' }],
    }),
    createClassRoom: build.mutation<IClassRoom, { name: string; cameraUrl: string; centerId: number }>({
      query: (body) => ({ url: '/ClassRooms', method: 'POST', data: body }),
      invalidatesTags: [{ type: 'ClassRoom', id: 'LIST' }],
    }),
    updateClassRoom: build.mutation<IClassRoom, { id: number; name: string; cameraUrl: string; centerId: number }>({
      query: ({ id, ...body }) => ({ url: `/ClassRooms/${id}`, method: 'PUT', data: body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'ClassRoom', id }, { type: 'ClassRoom', id: 'LIST' }],
    }),
    deleteClassRoom: build.mutation<null, number>({
      query: (id) => ({ url: `/ClassRooms/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'ClassRoom', id }, { type: 'ClassRoom', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetClassRoomsQuery,
  useCreateClassRoomMutation,
  useUpdateClassRoomMutation,
  useDeleteClassRoomMutation,
} = classRoomsApi
