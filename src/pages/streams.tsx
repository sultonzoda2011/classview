import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getCenters } from '../api/centerApi'
import { getClassrooms } from '../api/classRoomApi'
import { getStreamsAdmin, getStreamsUser } from '../api/streamApi'
import CreateClassRoomModal from '../components/modal/createClassroomModal'
import StreamVideoModal from '../components/modal/streamVideoModal'
import UpdateClassRoomModal from '../components/modal/updateClassroomModal'
import StreamCard from '../components/streamCard'
import type { AppDispatch, RootState } from '../store/store'
import type { CustomJwtPayload } from '../types/jwt'

const Streams: React.FC = () => {
  const { classrooms } = useSelector((state: RootState) => state.classRoom)
  const { stream } = useSelector((state: RootState) => state.stream)
  const dispatch: AppDispatch = useDispatch()
  const { centers } = useSelector((state: RootState) => state.center)
  const [searchTerm, setSearchTerm] = useState('')
  const [updateClassRoomModalOpen, setUpdateClassRoomModalOpen] = useState(false)
  const [id, setId] = useState(0)
  const [createClassroomModalOpen, setCreateClassRoomModalOpen] = useState(false)
  const [streamVideoModalOpen, setStreamVideoModalOpen] = useState(false)
  const { t } = useTranslation()

  const token = Cookies.get('token')
  const info = useMemo(() => (token ? jwtDecode<CustomJwtPayload>(token) : null), [token])

  useEffect(() => {
    dispatch(getClassrooms())
    if (info && (info.role === 'Admin' || info.role === 'SuperAdmin')) {
      dispatch(getCenters())
    }
    // NOTE: Do not auto-fetch streams here. Streams are fetched when the user clicks a classroom card.
  }, [dispatch, info])

  const handleOpenStream = (classroomId: number) => {
    // set selected id
    setId(classroomId)

    // fetch streams on-demand depending on role
    if (info && (info.role === 'Admin' || info.role === 'SuperAdmin')) {
      dispatch(getStreamsAdmin(classroomId))
    } else if (info && info.role === 'User') {
      dispatch(getStreamsUser())
    }

    // open modal
    setStreamVideoModalOpen(true)
  }
  const centeredClass = classrooms.map((classRoom) => ({
    ...classRoom,
    centerName: centers.find((center) => center.id === classRoom.centerId)?.name || '',
  }))

  const filteredClassRooms = centeredClass.filter((classRoom) =>
    classRoom.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <section className="p-6 min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">{t('navigation.streams')}</h1>
      </div>

      <div className="mb-6 w-full sm:w-1/2 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={t('common.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-gray-500 transition shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredClassRooms.map((element) => (
          <StreamCard
            key={element.id}
            id={element.id}
            name={element.name}
            center={element.centerName}
            onOpen={handleOpenStream}
            streamModalOpen={streamVideoModalOpen}
          />
        ))}
        {filteredClassRooms.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
            {t('common.noData')}
          </p>
        )}
      </div>

      <UpdateClassRoomModal
        id={id}
        updateClassRoomOpen={updateClassRoomModalOpen}
        setUpdateClassRoomOpen={setUpdateClassRoomModalOpen}
      />
      <CreateClassRoomModal
        createClassRoomOpen={createClassroomModalOpen}
        setCreateClassRoomOpen={setCreateClassRoomModalOpen}
      />
      <StreamVideoModal
        id={id}
        dataSrc={stream.data}
        streamModalOpen={streamVideoModalOpen}
        setStreamModalOpen={setStreamVideoModalOpen}
      />
    </section>
  )
}

export default Streams
