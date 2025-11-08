import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Phone } from 'lucide-react'
import type { AppDispatch, RootState } from '../store/store'
import { getCenters } from '../api/centerApi'
import FormInput from '../components/formInput'
import { createEmployee } from '../api/usersApi'
import { createEmployeeSchema, type CreateEmployeeInput } from '../types/users'

const CreateEmployee = () => {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const { centers } = useSelector((state: RootState) => state.center)

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      role: 'Admin',
      centerId: 0,
    },
  })

  useEffect(() => {
    dispatch(getCenters())
    setValue('role', 'Admin')
  }, [dispatch, setValue])

  const onSubmit = async (data: CreateEmployeeInput) => {
    await dispatch(createEmployee(data))
    navigate('/users')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 font-inter transition-colors duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-10 transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
          Добавить сотрудника
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ФИО</label>
            <FormInput
              name="fullName"
              placeholder="Введите ФИО"
              type="text"
              control={control}
              icon={User}
              error={errors.fullName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Телефон</label>
            <FormInput
              name="phoneNumber"
              placeholder="Введите номер телефона"
              type="text"
              control={control}
              icon={Phone}
              error={errors.phoneNumber}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Центр</label>
            <Controller
              name="centerId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
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
              <p className="text-red-500 text-sm mt-1">{errors.centerId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-4 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-lg"
              onClick={() => navigate('/users')}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="w-full bg-black dark:bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-black/90 dark:hover:bg-gray-800 transition-all shadow-lg"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEmployee
