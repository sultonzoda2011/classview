import { Key } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { changePassword } from '../../api/usersApi'
import type { AppDispatch } from '../../store/store'
import type { IChangePassword } from '../../types/users'
import FormInput from '../formInput'

interface IChangePasswordModalProps {
  changePasswordModalOpen: boolean
  setChangePasswordModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChangePasswordModal = ({
  changePasswordModalOpen,
  setChangePasswordModalOpen,
}: IChangePasswordModalProps) => {
  const { control, handleSubmit, reset } = useForm<IChangePassword>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const dispatch: AppDispatch = useDispatch()

  if (!changePasswordModalOpen) return null

  const onSubmit = (data: IChangePassword) => {
    dispatch(changePassword(data))
    reset()
    setChangePasswordModalOpen(false)
  }

  return (
    <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4 sm:p-0">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 sm:p-8 flex flex-col items-center animate-fadeIn mx-2 sm:mx-0">
        <Key className="text-blue-500 w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Смена пароля</h2>
        <p className="text-gray-600 text-center mb-6">
          Введите текущий и новый пароль для обновления.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          <FormInput
            name="currentPassword"
            placeholder="Текущий пароль"
            type="password"
            control={control}
            icon={Key}
          />
          <FormInput
            name="newPassword"
            placeholder="Новый пароль"
            type="password"
            control={control}
            icon={Key}
          />
          <FormInput
            name="confirmNewPassword"
            placeholder="Подтвердите новый пароль"
            type="password"
            control={control}
            icon={Key}
          />

          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={() => setChangePasswordModalOpen(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Закрыть
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
