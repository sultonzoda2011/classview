import { MapPin } from 'lucide-react'
import React from 'react'

interface IStreamCardProps {
  id: number
  name: string
  // optional callbacks: either the parent provides these setters or an onOpen handler
  setId?: React.Dispatch<React.SetStateAction<number>>
  center: string
  setStreamVideoModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
  streamModalOpen?: boolean
  onOpen?: (id: number) => void
}

const StreamCard: React.FC<IStreamCardProps> = ({
  id,
  name,
  center,
  setId,
  setStreamVideoModalOpen,
  onOpen,
}) => {
  return (
    <div
      onClick={() => {
  
        if (onOpen) {
          onOpen(id)
        } else {
          setStreamVideoModalOpen?.(true)
          setId?.(id)
        }
      }}
      className="w-full relative group bg-white/20 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
    >
      <div className="relative w-full h-40 sm:h-48 overflow-hidden rounded-t-3xl">
        <img
          src="https://modelteaching.com/wp-content/uploads/2019/04/Classroom-Procedures-min.jpg"
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <h2 className="text-white text-xl font-bold drop-shadow-lg">{name}</h2>
        </div>
      </div>

      {center && (
        <div className="p-4 flex flex-col gap-3 bg-white/10 backdrop-blur-sm rounded-b-3xl transition-colors duration-300 group-hover:bg-white/20">
          <div className="flex items-center text-gray-100 text-sm gap-2">
            <MapPin size={18} className="text-blue-400 group-hover:animate-pulse" />
            <span className="font-medium text-blue-400">{center || 'No Center'}</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-transparent group-hover:border-blue-400/50 transition-all duration-300"></div>
    </div>
  )
}

export default StreamCard
