import { ArrowLeft, Clock, Edit, GraduationCap, Mail, Phone, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
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

  const fields = user
    ? [
        { label: t('users.childName'), value: user.childName, icon: User },
        { label: t('auth.phone'), value: user.phoneNumber, icon: Phone },
        { label: t('auth.email'), value: user.email, icon: Mail },
        { label: t('pages.profile.info.startTime'), value: `${user.startTime ?? '—'} — ${user.endTime ?? '—'}`, icon: Clock },
        { label: t('classrooms.title'), value: classRoomName, icon: GraduationCap },
      ]
    : []

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4" />
        {t('navigation.back')}
      </Button>

      {isLoading || !user ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">{user.fullName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                  <Icon size={20} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button asChild>
                <Link to={`/update-user/${user.id}`}>
                  <Edit className="h-4 w-4" />
                  {t('common.edit')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UserDetails
