import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Объединяет classNames и убирает конфликты Tailwind-классов (последний побеждает). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
