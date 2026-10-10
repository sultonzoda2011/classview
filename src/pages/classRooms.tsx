import { GraduationCap, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ClassroomCard from '../components/classroom-card'
import ClassroomFormDialog from '../components/modal/classroom-form-dialog'
import SearchInput from '../components/search-input'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
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
    <section className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>{t('common.manage')} {t('classrooms.title')}</CardTitle>
            <CardDescription>{t('classrooms.title')}</CardDescription>
          </div>
          <Button
            onClick={() => {
              setEditing(null)
              setDialogOpen(true)
            }}
          >
            <Plus data-icon="inline-start" />
            {t('classrooms.createClassroom')}
          </Button>
        </CardHeader>
        <CardContent>
          <SearchInput value={search} onChange={setSearch} />
        </CardContent>
      </Card>

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
