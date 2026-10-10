import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone, User } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { SelectField } from '../components/fields/select-field'
import { TextField } from '../components/fields/text-field'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Form } from '../components/ui/form'
import { useAuth } from '../hooks/useAuth'
import { notify } from '../lib/notify'
import { useGetCentersQuery } from '../store/centersApi'
import { useCreateEmployeeMutation } from '../store/usersApi'
import { employeeSchema, type EmployeeFormInput } from '../types/users'

const CreateEmployee = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { info } = useAuth()
  const isSuperAdmin = info?.role === 'SuperAdmin'
  const { data: centers = [] } = useGetCentersQuery(undefined, { skip: !isSuperAdmin })
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation()

  const form = useForm<EmployeeFormInput>({
    resolver: zodResolver(useMemo(() => employeeSchema(t), [t])),
    defaultValues: { fullName: '', phoneNumber: '', email: '', centerId: isSuperAdmin ? 0 : Number(info?.centerId) || 0 },
  })

  const onSubmit = async (data: EmployeeFormInput) => {
    let created
    try {
      created = await createEmployee({ ...data, role: 'Admin' }).unwrap()
    } catch {
      return
    }
    notify.success(created.mailSent ? t('toasts.employeeCreatedMailSent') : t('toasts.employeeCreatedMailFailed'))
    navigate('/users')
  }

  return (
    <section>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('common.addEmployee')}</h1>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TextField control={form.control} name="fullName" label={t('users.fullName')} icon={User} />
              <TextField control={form.control} name="phoneNumber" label={t('auth.phone')} icon={Phone} />
              <TextField control={form.control} name="email" label={t('auth.email')} type="email" icon={Mail} />
              {isSuperAdmin && (
                <SelectField
                  control={form.control}
                  name="centerId"
                  label={t('classrooms.center')}
                  placeholder={t('classrooms.center')}
                  options={centers.map((c) => ({ value: String(c.id), label: c.name }))}
                />
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" loading={isLoading}>
                  {t('common.create')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  )
}

export default CreateEmployee
