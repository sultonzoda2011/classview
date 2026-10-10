import type { TFunction } from 'i18next'
import { z } from 'zod'

export interface IClassRoom {
  id: number
  name: string
  centerId: number
  /** У родителя (role=User) сервер отдаёт пустую строку — адрес камеры ему не положен */
  cameraUrl: string
}

export const classRoomSchema = (t: TFunction) =>
  z.object({
    name: z.string().trim().min(1, t('validation.required')).max(200, t('validation.tooLong')),
    cameraUrl: z
      .string()
      .trim()
      .regex(/^(rtsp|rtsps|http|https):\/\/\S+$/i, t('validation.cameraUrl')),
    centerId: z.number().int().positive(t('validation.selectCenter')),
  })

export type ClassRoomFormInput = z.infer<ReturnType<typeof classRoomSchema>>
