import { Edit, GraduationCap, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ClassroomFormDialog from '../components/modal/classroom-form-dialog'
import PageHeader from '../components/page-header'
import SearchInput from '../components/search-input'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ConfirmDialog } from '../components/ui/confirm-dialog'
import { EmptyState } from '../components/ui/empty-state'
import { Skeleton } from '../components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useAuth } from '../hooks/useAuth'
import { notify } from '../lib/notify'
import { useGetCentersQuery } from '../store/centersApi'
import { useDeleteClassRoomMutation, useGetClassRoomsQuery } from '../store/classRoomsApi'
import type { IClassRoom } from '../types/classRoom'

const ClassRooms = () => {
  const { t } = useTranslation()
  const { info } = useAuth()
  const { data: classRooms = [], isLoading } = useGetClassRoomsQuery()
  const { data: centers = [] } = useGetCentersQuery()
  const [deleteClassRoom, { isLoading: deleting }] = useDeleteClassRoomMutation()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<IClassRoom | null>(null)
  const [toDelete, setToDelete] = useState<IClassRoom | null>(null)

  const centerNameById = useMemo(() => new Map(centers.map((c) => [c.id, c.name])), [centers])
  const filtered = classRooms.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  const fixedCenterId = info?.role === 'Admin' ? Number(info.centerId) : undefined

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await deleteClassRoom(toDelete.id).unwrap()
      notify.success(t('toasts.classroomDeleted'))
    } catch {
      return
    }
    setToDelete(null)
  }

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={t('classrooms.title')}
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setDialogOpen(true)
            }}
          >
            <Plus />
            {t('classrooms.createClassroom')}
          </Button>
        }
      />

      <Card className="gap-4 overflow-hidden pb-0">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{t('classrooms.title')}</CardTitle>
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
            <EmptyState icon={GraduationCap} title={t('common.noData')} className="m-6 border-0" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t('classrooms.name')}</TableHead>
                  <TableHead>{t('classrooms.center')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('classrooms.cameraUrl')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((classRoom) => (
                  <TableRow key={classRoom.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                          <GraduationCap aria-hidden="true" className="size-4" />
                        </div>
                        <span className="truncate font-medium">{classRoom.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{centerNameById.get(classRoom.centerId) || t('common.noData')}</TableCell>
                    <TableCell className="hidden max-w-xs lg:table-cell">
                      <code className="block truncate text-xs text-muted-foreground">{classRoom.cameraUrl}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t('common.edit')}
                          title={t('common.edit')}
                          onClick={() => {
                            setEditing(classRoom)
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
                          onClick={() => setToDelete(classRoom)}
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

      <ClassroomFormDialog open={dialogOpen} onOpenChange={setDialogOpen} classRoom={editing} fixedCenterId={fixedCenterId} />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t('confirm.deleteClassroomTitle')}
        description={t('confirm.deleteClassroomDescription', { name: toDelete?.name })}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </section>
  )
}

export default ClassRooms
