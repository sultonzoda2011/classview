import { MapPin, PlayCircle } from 'lucide-react'
import { Card } from './ui/card'

interface Props {
  name: string
  center?: string
  onClick: () => void
}

const StreamCard = ({ name, center, onClick }: Props) => (
  <Card
    onClick={onClick}
    className="group relative overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="relative w-full h-40 sm:h-48 overflow-hidden">
      <img
        src="https://modelteaching.com/wp-content/uploads/2019/04/Classroom-Procedures-min.jpg"
        alt=""
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
        <h2 className="text-white text-lg font-bold truncate">{name}</h2>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
        <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
      </div>
    </div>
    {center && (
      <div className="p-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <MapPin size={16} className="text-blue-500 flex-shrink-0" />
        <span className="truncate">{center}</span>
      </div>
    )}
  </Card>
)

export default StreamCard
