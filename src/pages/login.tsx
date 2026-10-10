import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { TextField } from '../components/fields/text-field'
import LanguageSelect from '../components/language-select'
import ForgotPasswordDialog from '../components/modal/forgot-password-dialog'
import ThemeToggle from '../components/theme-toggle'
import { Button } from '../components/ui/button'
import { Form } from '../components/ui/form'
import { useAuth } from '../hooks/useAuth'
import { useLoginMutation } from '../store/accountApi'
import { loginSchema, type LoginInput } from '../types/login'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { info } = useAuth()
  const [login, { isLoading }] = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)

  const schema = useMemo(() => loginSchema(t), [t])
  const form = useForm<LoginInput>({
    resolver: zodResolver(schema),
    defaultValues: { phoneOrUserName: '', password: '' },
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data).unwrap()
    } catch {
      return
    }
    navigate(info?.role === 'SuperAdmin' ? '/' : '/streams')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex flex-col sm:flex-row w-full max-w-[1000px] rounded-2xl shadow-lg overflow-hidden">
        <div className="hidden sm:flex w-1/2 flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-10">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">ClassView</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{t('login.educationTagline')}</p>
        </div>

        <div className="w-full sm:w-1/2 flex flex-col justify-center px-8 sm:px-12 py-10 bg-white dark:bg-gray-900">
          <div className="flex justify-between items-center mb-4 gap-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('login.title')}</h2>
            <div className="flex items-center gap-2">
              <LanguageSelect />
              <ThemeToggle />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('login.subtitle')}</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <TextField
                control={form.control}
                name="phoneOrUserName"
                placeholder={t('login.usernamePlaceholder')}
                icon={User}
                autoComplete="username"
              />
              <TextField
                control={form.control}
                name="password"
                placeholder={t('login.passwordPlaceholder')}
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                autoComplete="current-password"
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white hover:underline transition-colors"
                >
                  {t('login.forgotPassword')}
                </button>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                {t('login.loginButton')}
              </Button>

              {form.formState.errors.root && (
                <p className="text-sm text-red-600 text-center">{form.formState.errors.root.message}</p>
              )}
            </form>
          </Form>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">{t('login.copyright')}</p>
        </div>
      </div>

      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} />
    </div>
  )
}

export default Login
