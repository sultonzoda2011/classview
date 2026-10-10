import { Video } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchInput from '../components/search-input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { EmptyState } from '../components/ui/empty-state'
import { Skeleton } from '../components/ui/skeleton'
import StreamCard from '../components/stream-card'
import StreamVideoDialog from '../components/modal/stream-video-dialog'
import { useAuth } from '../hooks/useAuth'
import { useGetCentersQuery } from '../store/centersApi'
import { useGetClassRoomsQuery } from '../store/classRoomsApi'

const Streams = () => {
  const { t } = useTranslation()
  const { info } = useAuth()
  const isAdminLike = info?.role === 'Admin' || info?.role === 'SuperAdmin'
  const { data: classRooms = [], isLoading } = useGetClassRoomsQuery()
  const { data: centers = [] } = useGetCentersQuery(undefined, { skip: !isAdminLike })
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<{ id: number; name: string } | null>(null)

  const centerNameById = useMemo(() => new Map(centers.map((c) => [c.id, c.name])), [centers])
  const filtered = classRooms.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <section className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('navigation.streams')}</CardTitle>
          <CardDescription>{t('classrooms.title')}</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchInput value={search} onChange={setSearch} />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <StreamCard
              key={c.id}
              name={c.name}
              center={isAdminLike ? centerNameById.get(c.centerId) : undefined}
              onClick={() => setSelected({ id: c.id, name: c.name })}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon={Video} title={t('common.noData')} />
      )}

      <StreamVideoDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        classRoomId={selected?.id ?? null}
        classRoomName={selected?.name}
      />
    </section>
  )
}

export default Streams
