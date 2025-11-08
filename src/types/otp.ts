import { z } from "zod"

export interface ISendOtpForm {
  phone: string
}

export interface IVerifyOtpForm {
  otpCode: string
}

export const sendOtpSchema = z.object({
  phone: z.string().min(3, "Номер телефона обязателен"),
})

export const verifyOtpSchema = z.object({
  otpCode: z.string().length(6, "Код должен состоять из 6 символов"),
})

export type SendOtpInput = z.infer<typeof sendOtpSchema>
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>
