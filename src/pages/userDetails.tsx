import { ArrowLeft, Clock, Edit, GraduationCap, Mail, Phone, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '../components/avatar'
import InfoItem from '../components/info-item'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { useGetClassRoomsQuery } from '../store/classRoomsApi'
import { useGetUserByIdQuery } from '../store/usersApi'

const UserDetails = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: user, isLoading } = useGetUserByIdQuery(id ?? '', { skip: !id })
  const { data: classRooms = [] } = useGetClassRoomsQuery()

  const classRoomName = classRooms.find((c) => c.id === user?.classRoomId)?.name ?? '—'

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft />
          {t('navigation.back')}
        </Button>
      </div>

      {isLoading || !user ? (
        <Skeleton className="h-80 rounded-xl" />
      ) : (
        <Card>
          <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Avatar name={user.fullName} size="lg" />
            <div className="flex min-w-0 flex-col items-center gap-2 sm:items-start">
              <CardTitle className="text-2xl leading-tight">{user.fullName}</CardTitle>
              <Badge variant="secondary">{t(`users.roles.${user.role}`)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InfoItem icon={User} label={t('users.childName')} value={user.childName} />
            <InfoItem icon={Phone} label={t('auth.phone')} value={user.phoneNumber} />
            <InfoItem icon={Mail} label={t('auth.email')} value={user.email} />
            <InfoItem icon={Clock} label={t('pages.profile.info.startTime')} value={`${user.startTime ?? '—'} — ${user.endTime ?? '—'}`} />
            <InfoItem icon={GraduationCap} label={t('classrooms.title')} value={classRoomName} />
          </CardContent>
          <CardFooter className="justify-end border-t">
            <Button asChild>
              <Link to={`/update-user/${user.id}`}>
                <Edit />
                {t('common.edit')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </section>
  )
}

export default UserDetails
