import { z } from "zod"

export interface IResetPasswordForm {
  newPassword: string
  confirmNewPassword: string
}

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(5, "Пароль должен содержать минимум 5 символов"),
    confirmNewPassword: z.string().min(5, "Подтверждение пароля обязательно"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Пароли должны совпадать",
    path: ["confirmNewPassword"],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
