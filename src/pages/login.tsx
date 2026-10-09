import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { Eye, EyeOff, Lock, Moon, Sun, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../api/loginApi'
import FormInput from '../components/formInput'
import LanguageSelect from '../components/languageSelect'
import ResetPasswordModal from '../components/modal/resetPasswordModal'
import SendOtpModal from '../components/modal/sendOtpModal'
import VerifyOtp from '../components/modal/verifyOtp'
import type { AppDispatch } from '../store/store'
import type { CustomJwtPayload } from '../types/jwt'
import { loginSchema, type LoginInput } from '../types/login'

const Login = () => {
	const { t, i18n } = useTranslation()
	const dispatch: AppDispatch = useDispatch()
	const navigate = useNavigate()

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: { phoneOrUserName: '', password: '' }
	})

	const [sendOtpModal, setSendOtpModal] = useState(false)
	const [verifyOtpModal, setVerifyOtpModal] = useState(false)
	const [resetModal, setResetModal] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [isDarkMode, setIsDarkMode] = useState(false)

	const languages = [
		{
			code: 'en',
			label: t('header.language.english'),
			flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1024px-Flag_of_the_United_Kingdom_%283-5%29.svg.png'
		},
		{
			code: 'tj',
			label: t('header.language.tajik'),
			flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/2560px-Flag_of_Tajikistan.svg.png'
		},
		{
			code: 'ru',
			label: t('header.language.russian'),
			flag: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJYo9xokjFiNZypS-HrcUiYsLuh-rPb3zKsQ&s'
		}
	]

	const [selectedLang, setSelectedLang] = useState(() => {
		const savedLang = languages.find(lang => lang.code === i18n.language)
		return savedLang || languages[0]
	})

	useEffect(() => {
		i18n.changeLanguage(selectedLang.code)
	}, [selectedLang, i18n])

	useEffect(() => {
		const theme = localStorage.getItem('theme')
		if (
			theme === 'dark' ||
			(!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			setIsDarkMode(true)
			document.documentElement.classList.add('dark')
		} else {
			setIsDarkMode(false)
			document.documentElement.classList.remove('dark')
		}
	}, [])

	const toggleDarkMode = () => {
		const newMode = !isDarkMode
		setIsDarkMode(newMode)
		if (newMode) {
			document.documentElement.classList.add('dark')
			localStorage.setItem('theme', 'dark')
		} else {
			document.documentElement.classList.remove('dark')
			localStorage.setItem('theme', 'light')
		}
	}

	const togglePasswordVisibility = () => setShowPassword(prev => !prev)

	const onSubmit = async (data: LoginInput) => {
		await dispatch(loginApi(data))
		const token = Cookies.get('token')
		let info: CustomJwtPayload | null = null
		if (token) {
			try {
				info = jwtDecode<CustomJwtPayload>(token)
			} catch (err) {
				console.error('Invalid token', err)
			}
		}
		if (info?.role === 'SuperAdmin') navigate('/')
		else navigate('/streams')
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 font-inter p-4 transition-colors duration-300">
			<div className="flex flex-col sm:flex-row w-full max-w-[1000px] rounded-2xl shadow-lg overflow-hidden animate-fade-in">
				<div className="hidden sm:flex w-1/2 flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 sm:p-10">
					<h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
						ClassView
					</h1>
					<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center">
						{t('login.educationTagline')}
					</p>
				</div>

				<div className="w-full sm:w-1/2 flex flex-col justify-center px-8 sm:px-12 py-10 bg-white dark:bg-gray-900 transition-colors duration-300">
					<div className="flex justify-between items-center mb-4 gap-2">
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
							{t('login.title')}
						</h2>

						<div className="flex items-center gap-2 relative">
							<LanguageSelect
								languages={languages}
								selectedLang={selectedLang}
								setSelectedLang={setSelectedLang}
							/>

							<button
								onClick={toggleDarkMode}
								className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-full transition-colors"
							>
								{isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
							</button>
						</div>
					</div>

					<p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
						{t('login.subtitle')}
					</p>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-5 relative"
					>
						<FormInput
							name="phoneOrUserName"
							placeholder={t('login.usernamePlaceholder')}
							type="text"
							control={control}
							icon={User}
							error={errors.phoneOrUserName}
						/>

						<div className="relative">
							<FormInput
								name="password"
								placeholder={t('login.passwordPlaceholder')}
								type={showPassword ? 'text' : 'password'}
								control={control}
								icon={Lock}
								error={errors.password}
							/>
							<button
								type="button"
								onClick={togglePasswordVisibility}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>

						<div className="text-right">
							<p
								onClick={() => setSendOtpModal(true)}
								className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white hover:underline cursor-pointer transition-colors"
							>
								{t('login.forgotPassword')}
							</p>
						</div>

						<button
							type="submit"
							className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-sm"
						>
							{t('login.loginButton')}
						</button>
					</form>

					<p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
						{t('login.copyright')}
					</p>
				</div>
			</div>

			{sendOtpModal && (
				<SendOtpModal
					sendOtpModal={sendOtpModal}
					setSendOtpModal={setSendOtpModal}
					onOpenVerify={() => setVerifyOtpModal(true)}
				/>
			)}
			{verifyOtpModal && (
				<VerifyOtp
					verifyOtpModal={verifyOtpModal}
					setVerifyOtpModal={setVerifyOtpModal}
					onOpenReset={() => setResetModal(true)}
				/>
			)}
			{resetModal && (
				<ResetPasswordModal
					resetModal={resetModal}
					setResetModal={setResetModal}
				/>
			)}
		</div>
	)
}

export default Login
