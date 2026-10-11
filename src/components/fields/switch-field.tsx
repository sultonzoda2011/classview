import type { Control, FieldValues, Path } from 'react-hook-form'
import { FormControl, FormField, FormItem } from '../ui/form'
import { Switch } from '../ui/switch'

interface SwitchFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
}

/** Единый переключатель формы (например, доступ к камере connect). */
export function SwitchField<T extends FieldValues>({ control, name, label, description }: SwitchFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{label}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <FormControl>
            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
