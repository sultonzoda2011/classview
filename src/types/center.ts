import { z } from "zod"

export interface ICenter {
  id: number
  name: string
  address: string
}

export interface ICenterState {
  centers: ICenter[]
}

export interface IUpdateCenter {
  name: string
  address: string
  id: number
}

export interface ICreateCenter {
  name: string
  address: string
}

export const createCenterSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  address: z.string().min(1, "Адрес обязателен"),
})

export const updateCenterSchema = z.object({
  id: z.number().int().positive("Некорректный ID"),
  name: z.string().min(1, "Название обязательно"),
  address: z.string().min(1, "Адрес обязателен"),
})

export type CreateCenterInput = z.infer<typeof createCenterSchema>
export type UpdateCenterInput = z.infer<typeof updateCenterSchema>
