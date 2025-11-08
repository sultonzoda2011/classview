import { z } from "zod"

export interface IStream {
  statusCode: number
  data: string
  message: string
}

export interface IStreamState {
  stream: IStream
}

export const streamSchema = z.object({
  statusCode: z.number().int().positive(),
  data: z.string().url("Некорректный URL потока видео"),
  message: z.string().min(1, "Сообщение обязательно"),
})

export type StreamInput = z.infer<typeof streamSchema>
