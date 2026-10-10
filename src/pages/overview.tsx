import { Building2, GraduationCap, Users as UsersIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { useGetCentersQuery } from '../store/centersApi'
import { useGetClassRoomsQuery } from '../store/classRoomsApi'
import { useGetUsersQuery } from '../store/usersApi'

const Overview = () => {
  const { t } = useTranslation()
  const { data: centers, isLoading: loadingCenters } = useGetCentersQuery()
  const { data: users, isLoading: loadingUsers } = useGetUsersQuery()
  const { data: classRooms, isLoading: loadingRooms } = useGetClassRoomsQuery()

  const stats = useMemo(
    () => [
      { title: t('overview.users'), count: users?.length ?? 0, icon: UsersIcon, bg: 'from-blue-400 to-blue-600' },
      { title: t('overview.centers'), count: centers?.length ?? 0, icon: Building2, bg: 'from-green-400 to-green-600' },
      { title: t('overview.classrooms'), count: classRooms?.length ?? 0, icon: GraduationCap, bg: 'from-purple-400 to-purple-600' },
    ],
    [t, users, centers, classRooms],
  )

  const loading = loadingCenters || loadingUsers || loadingRooms

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">{t('overview.title')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          : stats.map((stat) => (
              <Card key={stat.title} className={`bg-gradient-to-br ${stat.bg} text-white border-none shadow-md hover:shadow-xl transition-shadow`}>
                <CardContent className="pt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.count}</p>
                  </div>
                  <stat.icon className="w-12 h-12 opacity-70" />
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}

export default Overview
