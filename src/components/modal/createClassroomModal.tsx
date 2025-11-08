import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { Edit3, Save, Video, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { createClassroom } from '../../api/classRoomApi'
import type { AppDispatch, RootState } from '../../store/store'
import { createClassRoomSchema, type CreateClassRoomInput } from '../../types/classRoom'
import FormInput from '../formInput'

interface ICreateClassRoomProps {
  createClassRoomOpen: boolean
  setCreateClassRoomOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface IUserPayload {
  role: 'Admin' | 'SuperAdmin' | string
  centerId?: number
}

const CreateClassRoomModal = ({
  createClassRoomOpen,
  setCreateClassRoomOpen,
}: ICreateClassRoomProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClassRoomInput>({
    resolver: zodResolver(createClassRoomSchema),
    defaultValues: {
      name: '',
      cameraUrl: '',
      centerId: 0,
    },
  })

  const token = Cookies.get('token')
  const info: IUserPayload = jwtDecode(token as string)

  const dispatch: AppDispatch = useDispatch()
  const { centers } = useSelector((state: RootState) => state.center)

  const onSubmit = (data: CreateClassRoomInput) => {
    if (info.role === 'Admin') {
      data.centerId = info.centerId ?? 0
    }
    dispatch(createClassroom(data))
    setCreateClassRoomOpen(false)
    reset()
  }

  if (!createClassRoomOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70 flex items-center sm:items-center justify-center z-50 animate-fadeIn p-4 sm:p-0">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative mx-2 sm:mx-0">
        <button
          onClick={() => setCreateClassRoomOpen(false)}
          className="absolute top-4 right-4 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition"
        >
          <X size={22} />
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Edit3 size={24} className="text-black dark:text-white" />
          <h2 className="text-2xl font-extrabold text-black dark:text-white">Добавить класс</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1"
            >
              Название класса
            </label>
            <FormInput
              name="name"
              placeholder="Введите название"
              type="text"
              control={control}
              icon={Edit3}
              error={errors.name}
            />
          </div>

          <div>
            <label
              htmlFor="cameraUrl"
              className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1"
            >
              Ссылка на камеру
            </label>
            <FormInput
              name="cameraUrl"
              placeholder="Введите URL камеры"
              type="text"
              control={control}
              icon={Video}
              error={errors.cameraUrl}
            />
          </div>

          {info.role === 'SuperAdmin' && (
            <div>
              <label
                htmlFor="centerId"
                className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1"
              >
                Центр
              </label>
              <Controller
                name="centerId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400"
                  >
                    <option value={0}>Выберите центр</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                )}
              />

              {errors.centerId && (
                <p className="text-red-500 text-sm mt-1">{errors.centerId?.message}</p>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={() => setCreateClassRoomOpen(false)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-sm"
            >
              <X size={18} />
              Отмена
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-black/90 dark:hover:bg-white/90 transition-all shadow-md"
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

export default CreateClassRoomModal
