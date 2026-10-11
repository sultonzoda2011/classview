import { Building2, GraduationCap, Users as UsersIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PageHeader from '../components/page-header'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { EmptyState } from '../components/ui/empty-state'
import { Skeleton } from '../components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useGetCentersQuery } from '../store/centersApi'
import { useGetClassRoomsQuery } from '../store/classRoomsApi'
import { useGetUsersQuery } from '../store/usersApi'

const Overview = () => {
  const { t } = useTranslation()
  const { data: centers = [], isLoading: loadingCenters } = useGetCentersQuery()
  const { data: users = [], isLoading: loadingUsers } = useGetUsersQuery()
  const { data: classRooms = [], isLoading: loadingRooms } = useGetClassRoomsQuery()
  const loading = loadingCenters || loadingUsers || loadingRooms

  const stats = [
    { to: '/users', title: t('overview.users'), count: users.length, icon: UsersIcon },
    { to: '/centers', title: t('overview.centers'), count: centers.length, icon: Building2 },
    { to: '/classrooms', title: t('overview.classrooms'), count: classRooms.length, icon: GraduationCap },
  ]

  const rows = useMemo(
    () =>
      centers.map((center) => ({
        center,
        classRooms: classRooms.filter((c) => c.centerId === center.id).length,
        users: users.filter((u) => u.centerId === center.id).length,
      })),
    [centers, classRooms, users],
  )

  return (
    <section className="flex flex-col gap-6">
      <PageHeader title={t('overview.title')} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          : stats.map(({ to, title, count, icon: Icon }) => (
              <Link key={to} to={to} className="group rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
                <Card className="gap-4 transition-colors group-hover:border-primary/40">
                  <CardHeader>
                    <CardDescription>{title}</CardDescription>
                    <CardAction>
                      <div className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                        <Icon aria-hidden="true" className="size-4" />
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold tracking-tight tabular-nums">{count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      <Card className="gap-4 overflow-hidden pb-0">
        <CardHeader>
          <CardTitle>{t('centers.title')}</CardTitle>
        </CardHeader>
        <CardContent className="border-t px-0">
          {loading ? (
            <Skeleton className="m-6 h-40" />
          ) : rows.length === 0 ? (
            <EmptyState icon={Building2} title={t('common.noData')} className="m-6 mt-6" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t('centers.name')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('centers.address')}</TableHead>
                  <TableHead className="text-right">{t('classrooms.title')}</TableHead>
                  <TableHead className="text-right">{t('users.title')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ center, classRooms: roomCount, users: userCount }) => (
                  <TableRow key={center.id}>
                    <TableCell className="font-medium">{center.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">{center.address}</TableCell>
                    <TableCell className="text-right tabular-nums">{roomCount}</TableCell>
                    <TableCell className="text-right tabular-nums">{userCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export default Overview
