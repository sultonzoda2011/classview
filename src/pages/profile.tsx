import { Clock, GraduationCap, Lock, Mail, Phone, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../components/avatar'
import ChangePasswordDialog from '../components/modal/change-password-dialog'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
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

  if (isLoading || !user) return <Skeleton className="h-96 max-w-4xl mx-auto rounded-2xl" />

  const classroom = classRooms.find((c) => c.id === user.classRoomId)

  const fields = [
    { label: t('pages.profile.info.childName'), value: user.childName, icon: User },
    { label: t('auth.phone'), value: user.phoneNumber, icon: Phone },
    { label: t('auth.email'), value: user.email, icon: Mail },
    { label: t('pages.profile.info.startTime'), value: `${user.startTime ?? '—'} — ${user.endTime ?? '—'}`, icon: Clock },
    { label: t('pages.profile.info.classroom'), value: classroom?.name ?? t('common.noData'), icon: GraduationCap },
  ]

  return (
    <section className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="pt-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar name={user.fullName} size="lg" />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100">{user.fullName}</h2>
              <p className="text-gray-500 dark:text-gray-400">{t(`users.roles.${user.role}`)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400 dark:text-gray-500">{label}</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setChangePasswordOpen(true)}>
              <Lock className="h-4 w-4" />
              {t('auth.changePassword')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordDialog open={changePasswordOpen || mustChangePassword} onOpenChange={setChangePasswordOpen} required={mustChangePassword} />
    </section>
  )
}

export default Profile
