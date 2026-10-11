import { Building2, Edit, MapPin, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CenterFormDialog from '../components/modal/center-form-dialog'
import PageHeader from '../components/page-header'
import SearchInput from '../components/search-input'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ConfirmDialog } from '../components/ui/confirm-dialog'
import { EmptyState } from '../components/ui/empty-state'
import { Skeleton } from '../components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { notify } from '../lib/notify'
import { useDeleteCenterMutation, useGetCentersQuery } from '../store/centersApi'
import { useGetClassRoomsQuery } from '../store/classRoomsApi'
import type { ICenter } from '../types/center'

const Centers = () => {
  const { t } = useTranslation()
  const { data: centers = [], isLoading } = useGetCentersQuery()
  const { data: classRooms = [] } = useGetClassRoomsQuery()
  const [deleteCenter, { isLoading: deleting }] = useDeleteCenterMutation()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ICenter | null>(null)
  const [toDelete, setToDelete] = useState<ICenter | null>(null)

  const roomsByCenter = useMemo(() => {
    const map = new Map<number, number>()
    classRooms.forEach((c) => map.set(c.centerId, (map.get(c.centerId) ?? 0) + 1))
    return map
  }, [classRooms])

  const query = search.toLowerCase()
  const filtered = centers.filter((c) => c.name.toLowerCase().includes(query) || c.address.toLowerCase().includes(query))

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await deleteCenter(toDelete.id).unwrap()
      notify.success(t('toasts.centerDeleted'))
    } catch {
      return
    }
    setToDelete(null)
  }

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={t('centers.title')}
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setDialogOpen(true)
            }}
          >
            <Plus />
            {t('centers.addCenter')}
          </Button>
        }
      />

      <Card className="gap-4 overflow-hidden pb-0">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{t('centers.title')}</CardTitle>
            <Badge variant="secondary" className="tabular-nums">
              {filtered.length}
            </Badge>
          </div>
          <SearchInput value={search} onChange={setSearch} />
        </CardHeader>
        <CardContent className="border-t px-0">
          {isLoading ? (
            <Skeleton className="m-6 h-56" />
          ) : filtered.length === 0 ? (
            <EmptyState icon={Building2} title={t('common.noData')} className="m-6 border-0" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t('centers.name')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('centers.address')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('classrooms.title')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((center) => (
                  <TableRow key={center.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                          <Building2 aria-hidden="true" className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{center.name}</p>
                          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground md:hidden">
                            <MapPin aria-hidden="true" className="size-3 shrink-0" />
                            {center.address}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{center.address}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="tabular-nums">
                        {roomsByCenter.get(center.id) ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t('common.edit')}
                          title={t('common.edit')}
                          onClick={() => {
                            setEditing(center)
                            setDialogOpen(true)
                          }}
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          aria-label={t('common.delete')}
                          title={t('common.delete')}
                          onClick={() => setToDelete(center)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CenterFormDialog open={dialogOpen} onOpenChange={setDialogOpen} center={editing} />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t('confirm.deleteCenterTitle')}
        description={t('confirm.deleteCenterDescription', { name: toDelete?.name })}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </section>
  )
}

export default Centers
