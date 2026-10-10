import type { TFunction } from 'i18next'
import { z } from 'zod'

export const resetPasswordSchema = (t: TFunction) =>
  z
    .object({
      newPassword: z.string().min(6, t('validation.passwordMin')),
      confirmNewPassword: z.string().min(1, t('validation.required')),
    })
    .refine((d) => d.newPassword === d.confirmNewPassword, { message: t('validation.passwordsMatch'), path: ['confirmNewPassword'] })
export type ResetPasswordInput = z.infer<ReturnType<typeof resetPasswordSchema>>
