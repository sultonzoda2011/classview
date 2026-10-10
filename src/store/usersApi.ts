import type { IUser } from '../types/users'
import { api } from './api'

interface CreateUserBody {
  fullName: string
  childName: string
  phoneNumber: string
  email: string
  connect: boolean
  startTime: string
  endTime: string
  classRoomId: number
  centerId?: number
}
interface CreateEmployeeBody {
  fullName: string
  phoneNumber: string
  email: string
  role: 'Admin'
  centerId?: number
}

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<IUser[], void>({
      query: () => ({ url: '/Users' }),
      providesTags: (result) =>
        result ? [...result.map((u) => ({ type: 'User' as const, id: u.id })), { type: 'User', id: 'LIST' }] : [{ type: 'User', id: 'LIST' }],
    }),
    getUserById: build.query<IUser, string>({
      query: (id) => ({ url: `/Users/${id}` }),
      providesTags: (_r, _e, id) => [{ type: 'User', id }],
    }),
    createUser: build.mutation<IUser, CreateUserBody>({
      query: (body) => ({ url: '/Users', method: 'POST', data: body }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    createEmployee: build.mutation<IUser, CreateEmployeeBody>({
      query: (body) => ({ url: '/Users/create-employee', method: 'POST', data: body }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: build.mutation<IUser, { id: string } & Partial<CreateUserBody>>({
      query: ({ id, ...body }) => ({ url: `/Users/${id}`, method: 'PUT', data: body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
    }),
    deleteUser: build.mutation<null, string>({
      query: (id) => ({ url: `/Users/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useCreateEmployeeMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi
