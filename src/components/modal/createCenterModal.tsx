import React from 'react'
import { Edit3, MapPin, Save, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import { createCenter } from '../../api/centerApi'
import type { AppDispatch } from '../../store/store'
import {
  createCenterSchema,
  type CreateCenterInput,
} from '../../types/center'
import FormInput from '../formInput'

interface ICreateCenterModalProps {
  createCenterModalOpen: boolean
  setCreateCenterModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCenterModal = ({
  createCenterModalOpen,
  setCreateCenterModalOpen,
}: ICreateCenterModalProps) => {
  // ✅ Инициализация формы с Zod-валидацией
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCenterInput>({
    resolver: zodResolver(createCenterSchema),
    defaultValues: {
      name: '',
      address: '',
    },
  })

  const dispatch: AppDispatch = useDispatch()

  // ✅ Обработчик отправки формы
  const onSubmit = (data: CreateCenterInput) => {
    dispatch(createCenter(data))
    setCreateCenterModalOpen(false)
    reset()
  }

  if (!createCenterModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative transition-colors duration-300">
        <button
          onClick={() => setCreateCenterModalOpen(false)}
          className="absolute top-4 right-4 text-black/50 dark:text-gray-200 hover:text-black dark:hover:text-white transition"
        >
          <X size={22} />
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Edit3 size={24} className="text-black dark:text-gray-100" />
          <h2 className="text-2xl font-extrabold text-black dark:text-gray-100">
            Добавить центр
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Название центра */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black/70 dark:text-gray-300 mb-1"
            >
              Название центра
            </label>
            <FormInput
              name="name"
              placeholder="Введите название"
              type="text"
              control={control}
              icon={MapPin}
              error={errors.name}
            />
          </div>

          {/* Адрес центра */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-black/70 dark:text-gray-300 mb-1"
            >
              Адрес центра
            </label>
            <FormInput
              name="address"
              placeholder="Введите адрес"
              type="text"
              control={control}
              icon={MapPin}
              error={errors.address}
            />
          </div>

          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={() => setCreateCenterModalOpen(false)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-sm"
            >
              <X size={18} />
              Отмена
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-all shadow-md"
            >
              <Save size={18} />
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCenterModal
