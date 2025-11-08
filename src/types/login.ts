import { z } from "zod"

export interface ILogin {
  phoneOrUserName: string
  password: string
}

export const loginSchema = z.object({
  phoneOrUserName: z
    .string()
    .min(1, "Введите номер телефона или имя пользователя"),
  password: z
    .string()
    .min(4, "Пароль должен содержать минимум 5 символов"),
})

export type LoginInput = z.infer<typeof loginSchema>
