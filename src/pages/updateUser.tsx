import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import UserForm from '../components/forms/user-form'
import PageHeader from '../components/page-header'
import { Skeleton } from '../components/ui/skeleton'
import { useGetUserByIdQuery } from '../store/usersApi'

const UpdateUser = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading } = useGetUserByIdQuery(id ?? '', { skip: !id })

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader title={t('users.updateUser')} />
      {isLoading || !user ? <Skeleton className="h-96 rounded-xl" /> : <UserForm user={user} />}
    </section>
  )
}

export default UpdateUser
