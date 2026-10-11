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
import { Card } from '../components/ui/card'
import { Form } from '../components/ui/form'
import { useAuth } from '../hooks/useAuth'
import { useLoginMutation } from '../store/accountApi'
import { loginSchema, type LoginInput } from '../types/login'
import favicon from '/favicon.png'

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
		defaultValues: { phoneOrUserName: '', password: '' }
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
		<div className="flex min-h-svh items-center justify-center bg-background p-4">
			<Card className="w-full max-w-4xl flex-row gap-0 overflow-hidden py-0">
				<div className="stream-poster hidden w-1/2 flex-col justify-between p-10 text-sidebar-foreground sm:flex">
					<div className="flex items-center gap-3">
						<img
							src={favicon}
							alt=""
							className="size-10 rounded-md object-cover"
						/>
						<span className="text-lg font-semibold">ClassView</span>
					</div>
					<div className="space-y-2">
						<p className="text-3xl leading-tight font-semibold text-balance">
							{t('login.educationTagline')}
						</p>
					</div>
				</div>

				<div className="flex w-full flex-col justify-center gap-6 bg-card p-6 sm:w-1/2 sm:p-10">
					<div className="flex items-center gap-3 sm:hidden">
						<img
							src={favicon}
							alt=""
							className="size-9 rounded-md object-cover"
						/>
						<span className="font-semibold">ClassView</span>
					</div>

					<div className="flex items-start justify-between gap-3">
						<div className="space-y-1">
							<h1 className="text-2xl font-semibold tracking-tight">
								{t('login.title')}
							</h1>
							<p className="text-sm text-muted-foreground">
								{t('login.subtitle')}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<LanguageSelect />
							<ThemeToggle />
						</div>
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-4"
						>
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
										onClick={() => setShowPassword(v => !v)}
										className="rounded-sm p-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40"
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
									className="rounded-sm text-sm text-muted-foreground outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/40"
								>
									{t('login.forgotPassword')}
								</button>
							</div>

							<Button
								type="submit"
								className="w-full"
								size="lg"
								loading={isLoading}
							>
								{t('login.loginButton')}
							</Button>

							{form.formState.errors.root && (
								<p className="text-center text-sm text-destructive">
									{form.formState.errors.root.message}
								</p>
							)}
						</form>
					</Form>

					<p className="text-center text-xs text-muted-foreground">
						{t('login.copyright')}
					</p>
				</div>
			</Card>

			<ForgotPasswordDialog
				open={forgotOpen}
				onOpenChange={setForgotOpen}
			/>
		</div>
	)
}

export default Login
