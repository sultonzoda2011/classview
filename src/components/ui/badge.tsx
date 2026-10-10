import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors', {
  variants: {
    variant: {
      default: 'border-transparent bg-gray-900 text-white dark:bg-white dark:text-gray-900',
      secondary: 'border-transparent bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
      success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      destructive: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
      outline: 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
