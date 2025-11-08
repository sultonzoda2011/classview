import { X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { getUserById } from '../../api/usersApi'
import type { CustomJwtPayload } from '../../types/jwt'
import Cookies from 'js-cookie'

interface IStreamVideoModalProps {
  id: number
  dataSrc: string
  streamModalOpen: boolean
  setStreamModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const StreamVideoModal = ({
  dataSrc,
  streamModalOpen,
  setStreamModalOpen,
}: IStreamVideoModalProps) => {
  const token = Cookies.get('token')
  const info = token ? jwtDecode<CustomJwtPayload>(token) : null

  const { usersById } = useSelector((state: RootState) => state.users)
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    if (info?.nameid) {
      dispatch(getUserById(info.nameid))
    }
  }, [dispatch, info?.nameid])

  useEffect(() => {
    if (usersById?.endTime) {
      const now = new Date()
      const endTime = new Date(usersById.endTime)
      const twoMinutesLater = new Date(now.getTime() + 2 * 60 * 1000)

      if (endTime < twoMinutesLater) {
        alert('Время просмотра видео истекло.')
      }
    }
  }, [usersById])

  return (
    <>
      {streamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 p-2 sm:p-4">
          <div className="relative w-full h-full sm:h-auto max-w-full sm:max-w-[95%] bg-gray-900 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            <button
              onClick={() => setStreamModalOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 hover:bg-black/60 transition flex items-center justify-center"
            >
              <X size={28} className="text-white" />
            </button>

            <div className="w-full h-full sm:h-[90vh]">
              <video
                src={`${import.meta.env.VITE_API_URL_STREAMS}${dataSrc}`}
                controls
                className="w-full h-full object-contain bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StreamVideoModal
