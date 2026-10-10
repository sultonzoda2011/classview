import type { TFunction } from 'i18next'
import { z } from 'zod'

export const loginSchema = (t: TFunction) =>
  z.object({
    phoneOrUserName: z.string().trim().min(1, t('validation.required')),
    password: z.string().min(1, t('validation.required')),
  })
export type LoginInput = z.infer<ReturnType<typeof loginSchema>>
