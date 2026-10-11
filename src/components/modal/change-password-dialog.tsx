import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TextField } from '../fields/text-field'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form } from '../ui/form'
import { notify } from '../../lib/notify'
import { useChangePasswordMutation } from '../../store/accountApi'
import { changePasswordSchema, type ChangePasswordInput } from '../../types/users'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** true, если смена пароля обязательна (временный пароль) — тогда диалог нельзя закрыть крестиком */
  required?: boolean
}

const ChangePasswordDialog = ({ open, onOpenChange, required }: Props) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(useMemo(() => changePasswordSchema(t), [t])),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  })

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await changePassword(data).unwrap()
    } catch {
      return
    }
    notify.success(t('toasts.passwordChanged'))
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !required && onOpenChange(next)}>
      <DialogContent onInteractOutside={(e) => required && e.preventDefault()} onEscapeKeyDown={(e) => required && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('auth.changePassword')}</DialogTitle>
          {required && <DialogDescription>{t('modals.changePassword.required')}</DialogDescription>}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TextField
              control={form.control}
              name="currentPassword"
              label={t('modals.changePassword.current')}
              placeholder={t('modals.changePassword.current')}
              type={show ? 'text' : 'password'}
              icon={Lock}
              autoComplete="current-password"
            />
            <TextField
              control={form.control}
              name="newPassword"
              label={t('modals.changePassword.new')}
              placeholder={t('modals.changePassword.new')}
              type={show ? 'text' : 'password'}
              icon={Lock}
              autoComplete="new-password"
            />
            <TextField
              control={form.control}
              name="confirmNewPassword"
              label={t('modals.resetPassword.confirmPassword')}
              placeholder={t('modals.resetPassword.confirmPassword')}
              type={show ? 'text' : 'password'}
              icon={Lock}
              autoComplete="new-password"
              endAdornment={
                <button type="button" tabIndex={-1} onClick={() => setShow((v) => !v)} className="rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            <DialogFooter>
              {!required && (
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t('common.cancel')}
                </Button>
              )}
              <Button type="submit" loading={isLoading}>
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordDialog
