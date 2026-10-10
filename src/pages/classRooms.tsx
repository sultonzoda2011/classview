import { GraduationCap, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ClassroomCard from '../components/classroom-card'
import ClassroomFormDialog from '../components/modal/classroom-form-dialog'
import SearchInput from '../components/search-input'
import { Button } from '../components/ui/button'
import { EmptyState } from '../components/ui/empty-state'
import { Skeleton } from '../components/ui/skeleton'
import { useAuth } from '../hooks/useAuth'
import { useGetCentersQuery } from '../store/centersApi'
import { useGetClassRoomsQuery } from '../store/classRoomsApi'
import type { IClassRoom } from '../types/classRoom'

const ClassRooms = () => {
  const { t } = useTranslation()
  const { info } = useAuth()
  const { data: classRooms = [], isLoading } = useGetClassRoomsQuery()
  const { data: centers = [] } = useGetCentersQuery()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<IClassRoom | null>(null)

  const centerNameById = useMemo(() => new Map(centers.map((c) => [c.id, c.name])), [centers])
  const filtered = classRooms.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  const fixedCenterId = info?.role === 'Admin' ? Number(info.centerId) : undefined

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          {t('common.manage')} {t('classrooms.title')}
        </h1>
        <Button
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          {t('classrooms.createClassroom')}
        </Button>
      </div>

      <SearchInput value={search} onChange={setSearch} />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((classRoom) => (
            <ClassroomCard
              key={classRoom.id}
              classRoom={classRoom}
              centerName={centerNameById.get(classRoom.centerId) ?? ''}
              onEdit={(c) => {
                setEditing(c)
                setDialogOpen(true)
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon={GraduationCap} title={t('common.noData')} />
      )}

      <ClassroomFormDialog open={dialogOpen} onOpenChange={setDialogOpen} classRoom={editing} fixedCenterId={fixedCenterId} />
    </section>
  )
}

export default ClassRooms
