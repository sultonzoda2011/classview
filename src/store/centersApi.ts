import type { ICenter } from '../types/center'
import { api } from './api'

export const centersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCenters: build.query<ICenter[], void>({
      query: () => ({ url: '/Centers' }),
      providesTags: (result) =>
        result ? [...result.map((c) => ({ type: 'Center' as const, id: c.id })), { type: 'Center', id: 'LIST' }] : [{ type: 'Center', id: 'LIST' }],
    }),
    createCenter: build.mutation<ICenter, { name: string; address: string }>({
      query: (body) => ({ url: '/Centers', method: 'POST', data: body }),
      invalidatesTags: [{ type: 'Center', id: 'LIST' }],
    }),
    updateCenter: build.mutation<ICenter, { id: number; name: string; address: string }>({
      query: ({ id, ...body }) => ({ url: `/Centers/${id}`, method: 'PUT', data: body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Center', id }, { type: 'Center', id: 'LIST' }],
    }),
    deleteCenter: build.mutation<null, number>({
      query: (id) => ({ url: `/Centers/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Center', id }, { type: 'Center', id: 'LIST' }],
    }),
  }),
})

export const { useGetCentersQuery, useCreateCenterMutation, useUpdateCenterMutation, useDeleteCenterMutation } = centersApi
