import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { Clock, Phone, User } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getCenters } from '../api/centerApi'
import { getClassrooms } from '../api/classRoomApi'
import { createUser } from '../api/usersApi'
import FormInput from '../components/formInput'
import type { AppDispatch, RootState } from '../store/store'
import type { CustomJwtPayload } from '../types/jwt'
import { createUserSchema, type CreateUserInput } from '../types/users'

const CreateUser = () => {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const { centers } = useSelector((state: RootState) => state.center)
  const { classrooms } = useSelector((state: RootState) => state.classRoom)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
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
  const info: CustomJwtPayload = jwtDecode(token || '')

  useEffect(() => {
    dispatch(getCenters())
    dispatch(getClassrooms())
  }, [dispatch])

  const onSubmit = async (data: CreateUserInput) => {
    if (info.role === 'Admin') {
      data.centerId = Number(info.centerId) || 0
    }
    await dispatch(createUser(data))
    navigate('/users')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-inter px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-10 sm:p-8 transition-colors duration-300">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center tracking-wide">
          Добавление пользователя
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ФИО
            </label>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Имя ребенка
            </label>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Телефон
            </label>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Время начала
              </label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Время окончания
              </label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Кабинет
            </label>
            <Controller
              name="classRoomId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
          </div>

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

export default CreateUser
