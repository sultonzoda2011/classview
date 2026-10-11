import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, KeyRound, Lock, Mail } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TextField } from '../fields/text-field'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form } from '../ui/form'
import { notify } from '../../lib/notify'
import { useResetPasswordMutation, useSendOtpMutation, useVerifyOtpMutation } from '../../store/accountApi'
import { resetPasswordSchema, type ResetPasswordInput } from '../../types/resetPassword'
import { sendOtpSchema, verifyOtpSchema, type SendOtpInput, type VerifyOtpInput } from '../../types/otp'

type Step = 'email' | 'otp' | 'reset'
const OTP_SECONDS = 300

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Единый диалог восстановления пароля: email -> код с почты -> новый пароль. Заменяет 3 прежние модалки. */
const ForgotPasswordDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(OTP_SECONDS)
  const [showPassword, setShowPassword] = useState(false)

  const [sendOtp, { isLoading: sending }] = useSendOtpMutation()
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation()
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation()

  const emailForm = useForm<SendOtpInput>({ resolver: zodResolver(useMemo(() => sendOtpSchema(t), [t])), defaultValues: { email: '' } })
  const otpForm = useForm<VerifyOtpInput>({ resolver: zodResolver(useMemo(() => verifyOtpSchema(t), [t])), defaultValues: { otpCode: '' } })
  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(useMemo(() => resetPasswordSchema(t), [t])),
    defaultValues: { newPassword: '', confirmNewPassword: '' },
  })

  useEffect(() => {
    if (step !== 'otp' || secondsLeft <= 0) return
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [step, secondsLeft])

  const reset = () => {
    setStep('email')
    setEmail('')
    setResetToken('')
    emailForm.reset()
    otpForm.reset()
    resetForm.reset()
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const onSendOtp = async (data: SendOtpInput) => {
    try {
      await sendOtp(data).unwrap()
    } catch {
      return
    }
    setEmail(data.email)
    setSecondsLeft(OTP_SECONDS)
    setStep('otp')
  }

  const onResend = async () => {
    try {
      await sendOtp({ email }).unwrap()
    } catch {
      return
    }
    setSecondsLeft(OTP_SECONDS)
  }

  const onVerifyOtp = async (data: VerifyOtpInput) => {
    let token: string
    try {
      token = await verifyOtp({ email, otpCode: data.otpCode }).unwrap()
    } catch {
      return
    }
    setResetToken(token)
    setStep('reset')
  }

  const onResetPassword = async (data: ResetPasswordInput) => {
    try {
      await resetPassword({ email, token: resetToken, ...data }).unwrap()
    } catch {
      return
    }
    notify.success(t('toasts.passwordReset'))
    handleOpenChange(false)
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {step === 'email' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('modals.sendOtp.title')}</DialogTitle>
              <DialogDescription>{t('modals.sendOtp.description')}</DialogDescription>
            </DialogHeader>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-4">
                <TextField control={emailForm.control} name="email" type="email" icon={Mail} placeholder={t('modals.sendOtp.emailPlaceholder')} />
                <DialogFooter>
                  <Button type="submit" loading={sending}>
                    {t('modals.sendOtp.sendCode')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {step === 'otp' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('modals.verifyOtp.title')}</DialogTitle>
              <DialogDescription>{t('modals.verifyOtp.description', { email })}</DialogDescription>
            </DialogHeader>
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                <TextField
                  control={otpForm.control}
                  name="otpCode"
                  icon={KeyRound}
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {secondsLeft > 0 ? t('modals.verifyOtp.expiresIn', { time: `${mm}:${ss}` }) : t('modals.verifyOtp.expired')}
                  </span>
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={secondsLeft > OTP_SECONDS - 60 || sending}
                    className="font-medium text-foreground hover:underline disabled:opacity-40 disabled:no-underline"
                  >
                    {t('modals.verifyOtp.resend')}
                  </button>
                </div>
                <DialogFooter>
                  <Button type="submit" loading={verifying}>
                    {t('modals.verifyOtp.verify')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {step === 'reset' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('modals.resetPassword.title')}</DialogTitle>
              <DialogDescription>{t('modals.resetPassword.description')}</DialogDescription>
            </DialogHeader>
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                <TextField
                  control={resetForm.control}
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder={t('modals.resetPassword.newPassword')}
                  endAdornment={
                    <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)} className="rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                <TextField
                  control={resetForm.control}
                  name="confirmNewPassword"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder={t('modals.resetPassword.confirmPassword')}
                />
                <DialogFooter>
                  <Button type="submit" loading={resetting}>
                    {t('modals.resetPassword.submit')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordDialog
