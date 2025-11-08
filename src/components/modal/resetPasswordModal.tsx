import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { resetPasswordApi } from '../../api/reset-passwordApi'
import type { AppDispatch } from '../../store/store'
import { resetPasswordSchema, type ResetPasswordInput } from '../../types/resetPassword'
import FormInput from '../formInput'

interface IResetPasswordModalProps {
  resetModal: boolean
  setResetModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ResetPasswordModal = ({ resetModal, setResetModal }: IResetPasswordModalProps) => {
  const dispatch: AppDispatch = useDispatch()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmNewPassword: '' },
  })

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  if (!resetModal) return null

  const onSubmit = (data: ResetPasswordInput) => {
    const phoneOrUserName = localStorage.getItem('phoneNumber')
    const token = localStorage.getItem('token')

    if (!phoneOrUserName || !token) {
      alert('Ошибка: отсутствуют данные для сброса пароля.')
      return
    }

    dispatch(
      resetPasswordApi({
        phoneOrUserName,
        token,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      }),
    )

    localStorage.removeItem('token')
    localStorage.removeItem('phoneNumber')
    reset()
    setResetModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm dark:bg-black/70 p-4">
      <div className="relative w-full max-w-md sm:max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-2 text-center text-black dark:text-white">
          Сброс пароля
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
          Введите новый пароль и подтвердите его
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <FormInput
              name="newPassword"
              placeholder="Новый пароль"
              type={showNewPassword ? 'text' : 'password'}
              control={control}
              error={errors.newPassword}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div className="relative">
            <FormInput
              name="confirmNewPassword"
              placeholder="Подтвердите новый пароль"
              type={showConfirmPassword ? 'text' : 'password'}
              control={control}
              error={errors.confirmNewPassword}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setResetModal(false)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Закрыть
            </button>

            <button
              type="submit"
              className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl hover:bg-gray-900 dark:hover:bg-white/90 transition-colors font-medium"
            >
              Изменить пароль
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordModal
