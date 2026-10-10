import { setAuthToken } from '../hooks/useAuth'
import { api } from './api'

interface LoginBody {
  phoneOrUserName: string
  password: string
}
interface ChangePasswordBody {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}
interface ResetPasswordBody {
  email: string
  token: string
  newPassword: string
  confirmNewPassword: string
}

export const accountApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<string, LoginBody>({
      query: (body) => ({ url: '/Account/login', method: 'POST', data: body }),
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        const { data: token } = await queryFulfilled
        setAuthToken(token)
      },
    }),
    sendOtp: build.mutation<null, { email: string }>({
      query: (body) => ({ url: '/Account/send-otp', method: 'POST', data: body }),
    }),
    verifyOtp: build.mutation<string, { email: string; otpCode: string }>({
      query: (body) => ({ url: '/Account/verify-otp', method: 'POST', data: body }),
    }),
    resetPassword: build.mutation<null, ResetPasswordBody>({
      query: (body) => ({ url: '/Account/reset-password', method: 'POST', data: body }),
    }),
    changePassword: build.mutation<string, ChangePasswordBody>({
      query: (body) => ({ url: '/Account/change-password', method: 'POST', data: body }),
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        const { data: token } = await queryFulfilled
        setAuthToken(token)
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = accountApi
