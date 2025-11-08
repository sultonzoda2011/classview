import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getCenters } from '../api/centerApi'
import CenterCard from '../components/centerCard'
import CreateCenterModal from '../components/modal/createCenterModal'
import UpdateCenterModal from '../components/modal/updateCenterModal'
import type { AppDispatch, RootState } from '../store/store'

const Centers: React.FC = () => {
  const { centers } = useSelector((state: RootState) => state.center)
  const dispatch: AppDispatch = useDispatch()
  const { t } = useTranslation()

  const [searchTerm, setSearchTerm] = useState('')
  const [updateCenterModalOpen, setUpdateCenterModalOpen] = useState(false)
  const [id, setId] = useState(0)
  const [createCenterModalOpen, setCreateCenterModalOpen] = useState(false)

  useEffect(() => {
    dispatch(getCenters())
  }, [dispatch])

  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <section className="p-4 sm:p-6 lg:p-10 min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          {t('common.manage')} {t('centers.title')}
        </h1>
        <button
          onClick={() => setCreateCenterModalOpen(true)}
          className="bg-black text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm w-full sm:w-auto text-center"
        >
          + {t('centers.addCenter')}
        </button>
      </div>
      <div className="mb-6 w-full sm:w-1/2 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder={t('common.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 transition shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.length > 0 ? (
          filteredCenters.map((center) => (
            <CenterCard
              setId={setId}
              setUpdateCenterModalOpen={setUpdateCenterModalOpen}
              id={center.id}
              key={center.id}
              name={center.name}
              address={center.address}
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
            {t('common.noData')}
          </p>
        )}
      </div>

      <UpdateCenterModal
        id={id}
        updateCenterModalOpen={updateCenterModalOpen}
        setUpdateCenterModalOpen={setUpdateCenterModalOpen}
      />
      <CreateCenterModal
        createCenterModalOpen={createCenterModalOpen}
        setCreateCenterModalOpen={setCreateCenterModalOpen}
      />
    </section>
  )
}

export default Centers
