import { Edit3, MapPin, Save, X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateCenter } from '../../api/centerApi'
import type { AppDispatch, RootState } from '../../store/store'
import {
  updateCenterSchema,
  type UpdateCenterInput,
} from '../../types/center'
import FormInput from '../formInput'

interface IUpdateCenterModalProps {
  id: number
  updateCenterModalOpen: boolean
  setUpdateCenterModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateCenterModal = ({
  id,
  updateCenterModalOpen,
  setUpdateCenterModalOpen,
}: IUpdateCenterModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCenterInput>({
    resolver: zodResolver(updateCenterSchema),
    defaultValues: {
      id,
      name: '',
      address: '',
    },
  })

  const dispatch: AppDispatch = useDispatch()
  const { centers } = useSelector((state: RootState) => state.center)
  const infoCenter = centers.find((center) => center.id === id)

  useEffect(() => {
    if (infoCenter) {
      reset({
        id,
        name: infoCenter.name,
        address: infoCenter.address,
      })
    }
  }, [infoCenter, id, reset])

  const onSubmit = (data: UpdateCenterInput) => {
    dispatch(updateCenter(data))
    setUpdateCenterModalOpen(false)
  }

  if (!updateCenterModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative transition-colors duration-300">
        <button
          onClick={() => setUpdateCenterModalOpen(false)}
          className="absolute top-4 right-4 text-black/50 dark:text-gray-200 hover:text-black dark:hover:text-white transition"
        >
          <X size={22} />
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Edit3 size={24} className="text-black dark:text-gray-100" />
          <h2 className="text-2xl font-extrabold text-black dark:text-gray-100">
            Редактировать центр
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              onClick={() => setUpdateCenterModalOpen(false)}
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

export default UpdateCenterModal
