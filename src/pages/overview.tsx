import { Calendar, Home, Users } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getCenters } from '../api/centerApi'
import { getClassrooms } from '../api/classRoomApi'
import { getUsers } from '../api/usersApi'
import type { AppDispatch, RootState } from '../store/store'

const Overview = () => {
  const { centers } = useSelector((state: RootState) => state.center)
  const { users } = useSelector((state: RootState) => state.users)
  const { classrooms } = useSelector((state: RootState) => state.classRoom)
  const dispatch: AppDispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(getCenters())
    dispatch(getUsers())
    dispatch(getClassrooms())
  }, [dispatch])

  const stats = useMemo(
    () => [
      {
        title: t('overview.users'),
        count: users ? users.length : 0,
        icon: Users,
        bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      },
      {
        title: t('overview.centers'),
        count: centers ? centers.length : 0,
        icon: Home,
        bg: 'bg-gradient-to-br from-green-400 to-green-600',
      },
      {
        title: t('overview.classrooms'),
        count: classrooms ? classrooms.length : 0,
        icon: Calendar,
        bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
      },
    ],
    [t, users, centers, classrooms],
  )

  return (
    <div className="min-h-screen p-6 sm:p-10 font-inter">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        {t('overview.title')}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`
              ${stat.bg} text-white rounded-2xl p-6 shadow-md
              transition-all duration-300 ease-in-out
              hover:shadow-xl hover:translate-y-1
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{stat.count}</p>
              </div>
              <stat.icon className="w-12 h-12 opacity-70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Overview
