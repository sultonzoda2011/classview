import { Edit, MapPin, Trash } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteCenter } from '../api/centerApi'
import type { AppDispatch } from '../store/store'

interface ICenterCardProps {
  id: number
  name: string
  setId: React.Dispatch<React.SetStateAction<number>>
  address: string
  setUpdateCenterModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CenterCard: React.FC<ICenterCardProps> = ({
  id,
  name,
  address,
  setId,
  setUpdateCenterModalOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="relative w-full h-36 sm:h-44">
        <img
          src="https://images.adsttc.com/media/images/5b70/1438/f197/cc5a/2c00/0a09/newsletter/exterior_view-1.jpg?1534071815="
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <h2 className="text-white text-lg sm:text-xl font-bold truncate">{name}</h2>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between gap-3">
        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm sm:text-base gap-2 truncate">
          <MapPin size={16} className="text-red-500 flex-shrink-0" />
          <span className="truncate">{address || name}</span>
        </div>

        <div className="flex flex-row justify-end gap-3 mt-2">
          <button
            onClick={() => dispatch(deleteCenter(id))}
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
          >
            <Trash size={18} />
          </button>
          <button
            onClick={() => {
              setUpdateCenterModalOpen(true)
              setId(id)
            }}
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Edit size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CenterCard
