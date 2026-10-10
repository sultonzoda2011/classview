import type { TFunction } from 'i18next'
import { z } from 'zod'

export type Role = 'User' | 'Admin' | 'SuperAdmin'

export interface IUser {
  id: string
  fullName: string
  childName: string
  phoneNumber: string
  email: string
  role: Role
  connect: boolean
  createdAt: string
  startTime: string | null
  endTime: string | null
  classRoomId: number | null
  centerId: number | null
  /** Присутствует только в ответе на создание — отправлено ли письмо с паролем */
  mailSent?: boolean
}

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

export const userSchema = (t: TFunction) =>
  z.object({
    fullName: z.string().trim().min(1, t('validation.required')).max(200, t('validation.tooLong')),
    childName: z.string().trim().min(1, t('validation.required')).max(200, t('validation.tooLong')),
    phoneNumber: z.string().trim().min(5, t('validation.phone')).max(20, t('validation.tooLong')),
    email: z.string().trim().email(t('validation.email')),
    connect: z.boolean(),
    startTime: z.string().regex(TIME_REGEX, t('validation.time')),
    endTime: z.string().regex(TIME_REGEX, t('validation.time')),
    classRoomId: z.number().int().positive(t('validation.selectClassroom')),
    centerId: z.number().int().positive().optional(),
  })
export type UserFormInput = z.infer<ReturnType<typeof userSchema>>

export const employeeSchema = (t: TFunction) =>
  z.object({
    fullName: z.string().trim().min(1, t('validation.required')).max(200, t('validation.tooLong')),
    phoneNumber: z.string().trim().min(5, t('validation.phone')).max(20, t('validation.tooLong')),
    email: z.string().trim().email(t('validation.email')),
    centerId: z.number().int().positive().optional(),
  })
export type EmployeeFormInput = z.infer<ReturnType<typeof employeeSchema>>

export const changePasswordSchema = (t: TFunction) =>
  z
    .object({
      currentPassword: z.string().min(1, t('validation.required')),
      newPassword: z.string().min(6, t('validation.passwordMin')),
      confirmNewPassword: z.string().min(1, t('validation.required')),
    })
    .refine((d) => d.newPassword === d.confirmNewPassword, { message: t('validation.passwordsMatch'), path: ['confirmNewPassword'] })
export type ChangePasswordInput = z.infer<ReturnType<typeof changePasswordSchema>>
