import { z } from 'zod'


export interface IClassRoom {
  id: number
  name: string
  centerId: number
  cameraUrl: string
}

export interface IClassRoomState {
  classrooms: IClassRoom[]
}

export interface ICreateClassRoom {
  name: string
  centerId: number
  cameraUrl: string
}

export interface IUpdateClassRoom extends ICreateClassRoom {
  id: number
}


export const createClassRoomSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  cameraUrl: z.string().url('Введите корректный URL'),
  centerId: z.number().min(1, 'Выберите центр'),
})
export type CreateClassRoomInput = z.infer<typeof createClassRoomSchema>

export const updateClassRoomSchema = createClassRoomSchema
export type UpdateClassRoomInput = z.infer<typeof updateClassRoomSchema>
