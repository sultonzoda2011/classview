import { z } from "zod"

export interface IUser {
  id: string
  fullName: string
  childName: string
  phoneNumber: string
  connect: boolean
  createdAt: string
  startTime: string
  endTime: string
  classRoomId: number
  centerId: number
}

export interface IUserState {
  users: IUser[]
  usersById: IUser
}

export interface IUpdateUser {
  id: string
  fullName: string
  childName: string
  phoneNumber: string
  connect: boolean
  startTime: string
  endTime: string
  classRoomId: number
  centerId: number
}

export interface ICreateUser {
  fullName: string
  childName: string
  phoneNumber: string
  connect: boolean
  startTime: string
  endTime: string
  classRoomId: number
  centerId: number
}

export interface ICreateEmployee {
  fullName: string
  phoneNumber: string
  role: string
  centerId: number
}

export interface IChangePassword {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export const createUserSchema = z.object({
  fullName: z.string().min(1, "ФИО обязательно"),
  childName: z.string().min(1, "Имя ребенка обязательно"),
  phoneNumber: z.string().min(3, "Телефон обязателен"),
  connect: z.boolean(),
  startTime: z.string().min(1, "Время начала обязательно"),
  endTime: z.string().min(1, "Время окончания обязательно"),
  classRoomId: z.number().int().positive("Некорректный ID класса"),
  centerId: z.number().int().positive("Некорректный ID центра"),
})

export const updateUserSchema = createUserSchema.extend({
  id: z.string().min(1, "ID пользователя обязателен"),
})

export const createEmployeeSchema = z.object({
  fullName: z.string().min(1, "ФИО обязательно"),
  phoneNumber: z.string().min(3, "Телефон обязателен"),
  role: z.string().min(1, "Роль обязательна"),
  centerId: z.number().int().positive("Некорректный ID центра"),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Текущий пароль обязателен"),
    newPassword: z.string().min(6, "Новый пароль должен содержать минимум 6 символов"),
    confirmNewPassword: z.string().min(6, "Подтверждение пароля обязательно"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Пароли должны совпадать",
    path: ["confirmNewPassword"],
  })

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
