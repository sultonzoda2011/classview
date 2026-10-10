import { Building2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CenterCard from '../components/center-card'
import CenterFormDialog from '../components/modal/center-form-dialog'
import SearchInput from '../components/search-input'
import { Button } from '../components/ui/button'
import { EmptyState } from '../components/ui/empty-state'
import { Skeleton } from '../components/ui/skeleton'
import { useGetCentersQuery } from '../store/centersApi'
import type { ICenter } from '../types/center'

const Centers = () => {
  const { t } = useTranslation()
  const { data: centers = [], isLoading } = useGetCentersQuery()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ICenter | null>(null)

  const filtered = centers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <section className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          {t('common.manage')} {t('centers.title')}
        </h1>
        <Button
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          {t('centers.addCenter')}
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
          {filtered.map((center) => (
            <CenterCard
              key={center.id}
              center={center}
              onEdit={(c) => {
                setEditing(c)
                setDialogOpen(true)
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon={Building2} title={t('common.noData')} />
      )}

      <CenterFormDialog open={dialogOpen} onOpenChange={setDialogOpen} center={editing} />
    </section>
  )
}

export default Centers
