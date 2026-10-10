import type { Control, FieldValues, Path } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  placeholder?: string
  disabled?: boolean
  options: { value: string; label: string }[]
}

/** Единое поле-выбор формы (центр, класс, роль и т.д.) — такой же паттерн, как у TextField. */
export function SelectField<T extends FieldValues>({ control, name, label, placeholder, disabled, options }: SelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            value={field.value != null && field.value !== '' ? String(field.value) : undefined}
            onValueChange={(v) => field.onChange(Number.isNaN(Number(v)) ? v : Number(v))}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
