import { MapPin, Play, Video } from 'lucide-react'
import { Card } from './ui/card'

interface Props {
  name: string
  center?: string
  onClick: () => void
}

const StreamCard = ({ name, center, onClick }: Props) => (
  <Card className="group gap-0 overflow-hidden py-0">
    <button
      type="button"
      onClick={onClick}
      aria-label={name}
      className="stream-poster relative block aspect-video w-full outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/60"
    >
      <span className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-md bg-white/10 text-sidebar-foreground">
        <Video aria-hidden="true" className="size-4" />
      </span>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-lg transition-transform group-hover:scale-105">
          <Play aria-hidden="true" className="ml-0.5 size-6 fill-current" />
        </span>
      </span>
    </button>
    <div className="flex flex-col gap-1 p-4">
      <p className="truncate font-semibold">{name}</p>
      {center && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="truncate">{center}</span>
        </p>
      )}
    </div>
  </Card>
)

export default StreamCard
