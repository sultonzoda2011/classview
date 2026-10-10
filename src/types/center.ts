import type { TFunction } from 'i18next'
import { z } from 'zod'

export interface ICenter {
  id: number
  name: string
  address: string
}

export const centerSchema = (t: TFunction) =>
  z.object({
    name: z.string().trim().min(1, t('validation.required')).max(200, t('validation.tooLong')),
    address: z.string().trim().min(1, t('validation.required')).max(300, t('validation.tooLong')),
  })

export type CenterFormInput = z.infer<ReturnType<typeof centerSchema>>
