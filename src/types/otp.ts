import type { TFunction } from 'i18next'
import { z } from 'zod'

export const sendOtpSchema = (t: TFunction) =>
  z.object({ email: z.string().trim().email(t('validation.email')) })
export type SendOtpInput = z.infer<ReturnType<typeof sendOtpSchema>>

export const verifyOtpSchema = (t: TFunction) =>
  z.object({ otpCode: z.string().trim().length(6, t('validation.otpLength')) })
export type VerifyOtpInput = z.infer<ReturnType<typeof verifyOtpSchema>>
