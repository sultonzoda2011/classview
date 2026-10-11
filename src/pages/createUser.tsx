import { useTranslation } from 'react-i18next'
import UserForm from '../components/forms/user-form'
import PageHeader from '../components/page-header'

const CreateUser = () => {
  const { t } = useTranslation()
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader title={t('users.createUser')} />
      <UserForm />
    </section>
  )
}

export default CreateUser
