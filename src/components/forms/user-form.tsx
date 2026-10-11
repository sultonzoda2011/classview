import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone, User } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { notify } from '../../lib/notify'
import { useGetCentersQuery } from '../../store/centersApi'
import { useGetClassRoomsQuery } from '../../store/classRoomsApi'
import { useCreateUserMutation, useUpdateUserMutation } from '../../store/usersApi'
import { userSchema, type IUser, type UserFormInput } from '../../types/users'
import { useAuth } from '../../hooks/useAuth'
import { SelectField } from '../fields/select-field'
import { SwitchField } from '../fields/switch-field'
import { TextField } from '../fields/text-field'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Form } from '../ui/form'

interface Props {
  /** Если передан — форма редактирования существующего родителя */
  user?: IUser
}

/** Единая форма родителя: используется и для создания, и для редактирования. */
const UserForm = ({ user }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { info } = useAuth()
  const isEdit = !!user
  const isSuperAdmin = info?.role === 'SuperAdmin'

  const { data: centers = [] } = useGetCentersQuery(undefined, { skip: !isSuperAdmin })
  const { data: classRooms = [] } = useGetClassRoomsQuery()
  const [createUser, { isLoading: creating }] = useCreateUserMutation()
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation()

  const form = useForm<UserFormInput>({
    resolver: zodResolver(useMemo(() => userSchema(t), [t])),
    defaultValues: {
      fullName: user?.fullName ?? '',
      childName: user?.childName ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      email: user?.email ?? '',
      connect: user?.connect ?? false,
      startTime: user?.startTime ?? '09:00',
      endTime: user?.endTime ?? '18:00',
      classRoomId: user?.classRoomId ?? 0,
      centerId: user?.centerId ?? (isSuperAdmin ? 0 : Number(info?.centerId) || 0),
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName,
        childName: user.childName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        connect: user.connect,
        startTime: user.startTime ?? '09:00',
        endTime: user.endTime ?? '18:00',
        classRoomId: user.classRoomId ?? 0,
        centerId: user.centerId ?? 0,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const watchedCenterId = form.watch('centerId')
  const classRoomOptions = useMemo(
    () =>
      classRooms
        .filter((c) => !isSuperAdmin || !watchedCenterId || c.centerId === watchedCenterId)
        .map((c) => ({ value: String(c.id), label: c.name })),
    [classRooms, isSuperAdmin, watchedCenterId],
  )

  const onSubmit = async (data: UserFormInput) => {
    try {
      if (isEdit) {
        await updateUser({ id: user.id, ...data }).unwrap()
        notify.success(t('toasts.userUpdated'))
      } else {
        const created = await createUser(data).unwrap()
        notify.success(created.mailSent ? t('toasts.userCreatedMailSent') : t('toasts.userCreatedMailFailed'))
      }
    } catch {
      return
    }
    navigate('/users')
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField control={form.control} name="fullName" label={t('users.fullName')} placeholder={t('users.fullName')} icon={User} />
              <TextField control={form.control} name="childName" label={t('users.childName')} placeholder={t('users.childName')} icon={User} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField control={form.control} name="phoneNumber" label={t('auth.phone')} placeholder={t('auth.phone')} icon={Phone} />
              <TextField control={form.control} name="email" label={t('auth.email')} type="email" placeholder={t('auth.email')} icon={Mail} />
            </div>

            {isSuperAdmin && (
              <SelectField
                control={form.control}
                name="centerId"
                label={t('classrooms.center')}
                placeholder={t('classrooms.center')}
                options={centers.map((c) => ({ value: String(c.id), label: c.name }))}
              />
            )}
            <SelectField
              control={form.control}
              name="classRoomId"
              label={t('classrooms.title')}
              placeholder={t('classrooms.title')}
              options={classRoomOptions}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField control={form.control} name="startTime" label={t('pages.profile.info.startTime')} type="time" />
              <TextField control={form.control} name="endTime" label={t('pages.profile.info.endTime')} type="time" />
            </div>

            <SwitchField control={form.control} name="connect" label={t('users.connect')} description={t('users.connectDescription')} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" loading={creating || updating}>
                {isEdit ? t('common.save') : t('common.create')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UserForm
