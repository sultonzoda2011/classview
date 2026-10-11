import { Clock, GraduationCap, Lock, Mail, Phone, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../components/avatar'
import InfoItem from '../components/info-item'
import ChangePasswordDialog from '../components/modal/change-password-dialog'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { useAuth } from '../hooks/useAuth'
import { useGetClassRoomsQuery } from '../store/classRoomsApi'
import { useGetUserByIdQuery } from '../store/usersApi'

const Profile = () => {
  const { t } = useTranslation()
  const { info, mustChangePassword } = useAuth()
  const { data: user, isLoading } = useGetUserByIdQuery(info?.nameid ?? '', { skip: !info?.nameid })
  const { data: classRooms = [] } = useGetClassRoomsQuery()
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)

  if (isLoading || !user) return <Skeleton className="mx-auto h-80 max-w-3xl rounded-xl" />

  const classroom = classRooms.find((c) => c.id === user.classRoomId)

  return (
    <section className="mx-auto max-w-3xl">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar name={user.fullName} size="lg" />
          <div className="flex min-w-0 flex-col items-center gap-2 sm:items-start">
            <CardTitle className="text-2xl leading-tight">{user.fullName}</CardTitle>
            <Badge variant="secondary">{t(`users.roles.${user.role}`)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InfoItem icon={User} label={t('pages.profile.info.childName')} value={user.childName} />
          <InfoItem icon={Phone} label={t('auth.phone')} value={user.phoneNumber} />
          <InfoItem icon={Mail} label={t('auth.email')} value={user.email} />
          <InfoItem icon={Clock} label={t('pages.profile.info.startTime')} value={`${user.startTime ?? '—'} — ${user.endTime ?? '—'}`} />
          <InfoItem icon={GraduationCap} label={t('pages.profile.info.classroom')} value={classroom?.name ?? t('common.noData')} />
        </CardContent>
        <CardFooter className="justify-end border-t">
          <Button onClick={() => setChangePasswordOpen(true)}>
            <Lock />
            {t('auth.changePassword')}
          </Button>
        </CardFooter>
      </Card>

      <ChangePasswordDialog open={changePasswordOpen || mustChangePassword} onOpenChange={setChangePasswordOpen} required={mustChangePassword} />
    </section>
  )
}

export default Profile
