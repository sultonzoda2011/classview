import type { LucideIcon } from 'lucide-react'

/** Строка «иконка + подпись + значение» для карточек профиля и деталей пользователя. */
const InfoItem = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
      <Icon aria-hidden="true" className="size-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-medium">{value}</p>
    </div>
  </div>
)

export default InfoItem
