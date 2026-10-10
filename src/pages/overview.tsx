import { Building2, GraduationCap, Users as UsersIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
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
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t('overview.title')}</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          : stats.map((stat) => (
              <Card key={stat.title} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`rounded-lg bg-gradient-to-br ${stat.bg} p-2.5 text-white`}>
                    <stat.icon aria-hidden="true" className="size-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold tracking-tight text-foreground">{stat.count}</p>
                </CardContent>
              </Card>
            ))}
      </div>
    </section>
  )
}

export default Overview
