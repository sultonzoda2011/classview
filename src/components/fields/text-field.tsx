import type { LucideIcon } from 'lucide-react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Input } from '../ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  placeholder?: string
  type?: string
  icon?: LucideIcon
  disabled?: boolean
  endAdornment?: React.ReactNode
  autoComplete?: string
}

/** Единое текстовое поле формы — label + input + сообщение об ошибке, используется во всех формах приложения. */
export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  icon: Icon,
  disabled,
  endAdornment,
  autoComplete,
}: TextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />}
              <Input
                {...field}
                value={field.value ?? ''}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                className={Icon ? 'pl-9' : undefined}
              />
              {endAdornment && <div className="absolute right-2 top-1/2 -translate-y-1/2">{endAdornment}</div>}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
