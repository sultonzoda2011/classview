import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Phone, Clock } from 'lucide-react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import FormInput from '../components/formInput'
import type { AppDispatch, RootState } from '../store/store'
import { getCenters } from '../api/centerApi'
import { getClassrooms } from '../api/classRoomApi'
import { getUserById, updateUser } from '../api/usersApi'
import { updateUserSchema, type UpdateUserInput } from '../types/users'

const UpdateUser = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const { usersById } = useSelector((state: RootState) => state.users)
  const { centers } = useSelector((state: RootState) => state.center)
  const { classrooms } = useSelector((state: RootState) => state.classRoom)

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: '',
      childName: '',
      phoneNumber: '',
      connect: false,
      startTime: '',
      endTime: '',
      classRoomId: 0,
      centerId: 0,
    },
  })

  const token = Cookies.get('token')
  const info = jwtDecode<{ role: string }>(token || '')

  useEffect(() => {
    if (id) dispatch(getUserById(id))
    dispatch(getCenters())
    dispatch(getClassrooms())
  }, [dispatch, id])

  useEffect(() => {
    if (usersById) {
      reset({
        fullName: usersById.fullName || '',
        childName: usersById.childName || '',
        phoneNumber: usersById.phoneNumber || '',
        connect: usersById.connect || false,
        startTime: usersById.startTime ? usersById.startTime.slice(0, 5) : '',
        endTime: usersById.endTime ? usersById.endTime.slice(0, 5) : '',
        classRoomId: usersById.classRoomId || 0,
        centerId: usersById.centerId || 0,
      })
    }
  }, [usersById, reset])

  const onSubmit = async (data: UpdateUserInput) => {
    await dispatch(updateUser({ id: String(id), ...data }))
    navigate('/users')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-inter px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-10 sm:p-8 transition-colors duration-300">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center tracking-wide">
          Редактировать пользователя
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ФИО</label>
            <FormInput
              name="fullName"
              placeholder="ФИО"
              type="text"
              control={control}
              icon={User}
              error={errors.fullName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Имя ребенка</label>
            <FormInput
              name="childName"
              placeholder="Имя ребенка"
              type="text"
              control={control}
              icon={User}
              error={errors.childName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Телефон</label>
            <FormInput
              name="phoneNumber"
              placeholder="Телефон"
              type="text"
              control={control}
              icon={Phone}
              error={errors.phoneNumber}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус подключения
            </label>
            <Controller
              name="connect"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value ? 'true' : 'false'}
                  onChange={(e) => field.onChange(e.target.value === 'true')}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white shadow-sm transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              )}
            />
            {errors.connect && <p className="text-red-500 text-sm mt-1">{errors.connect.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Время начала</label>
              <FormInput
                name="startTime"
                placeholder="Время начала"
                type="time"
                control={control}
                icon={Clock}
                error={errors.startTime}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Время окончания</label>
              <FormInput
                name="endTime"
                placeholder="Время окончания"
                type="time"
                control={control}
                icon={Clock}
                error={errors.endTime}
              />
            </div>
          </div>

          {info.role === 'SuperAdmin' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Центр</label>
                <Controller
                  name="centerId"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white shadow-sm transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                {errors.centerId && <p className="text-red-500 text-sm mt-1">{errors.centerId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Кабинет</label>
                <Controller
                  name="classRoomId"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white shadow-sm transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value={0}>Выберите кабинет</option>
                      {classrooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.classRoomId && <p className="text-red-500 text-sm mt-1">{errors.classRoomId.message}</p>}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="w-full mb-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-4 rounded-2xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-lg"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="w-full mb-4 bg-gradient-to-r from-black to-gray-800 dark:from-gray-900 dark:to-gray-700 text-white py-4 rounded-2xl font-semibold hover:from-gray-800 hover:to-black dark:hover:from-gray-700 dark:hover:to-gray-900 transition-all shadow-lg"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateUser
