import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/store'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { getClassrooms } from '../api/classRoomApi'
import ClassRoomCard from '../components/classRoomCard'
import { getCenters } from '../api/centerApi'
import CreateClassRoomModal from '../components/modal/createClassroomModal'
import UpdateClassRoomModal from '../components/modal/updateClassroomModal'
import { useTranslation } from 'react-i18next'

const ClassRooms: React.FC = () => {
  const { classrooms } = useSelector((state: RootState) => state.classRoom)
  const dispatch: AppDispatch = useDispatch()
  const { centers } = useSelector((state: RootState) => state.center)
  const [searchTerm, setSearchTerm] = useState('')
  const [updateClassRoomModalOpen, setUpdateClassRoomModalOpen] = useState(false)
  const [id, setId] = useState(0)
  const [createClassroomModalOpen, setCreateClassRoomModalOpen] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(getClassrooms())
    dispatch(getCenters())
  }, [dispatch])

  const centeredClass = classrooms.map((classRoom) => ({
    ...classRoom,
    centerName: centers.find((center) => center.id === classRoom.centerId)?.name || '',
  }))

  const filteredClassRooms = centeredClass.filter((classRoom) =>
    classRoom.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <section className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('common.manage')} {t('classrooms.title')}</h1>
        <button
          onClick={() => setCreateClassRoomModalOpen(true)}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          + {t('classrooms.createClassroom')}
        </button>
      </div>

      <div className="mb-6 w-full sm:w-1/2 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder={t('common.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-100 transition shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredClassRooms.map((element) => (
          <ClassRoomCard
            key={element.id}
            id={element.id}
            name={element.name}
            cameraUrl={element.cameraUrl}
            setId={setId}
            setUpdateClassRoomModalOpen={setUpdateClassRoomModalOpen}
            center={element.centerName}
          />
        ))}
        {filteredClassRooms.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">{t('common.noData')}</p>
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
    </section>
  )
}

export default ClassRooms
