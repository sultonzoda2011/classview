import { Check, Edit, Eye, Minus, Plus, Trash2, Users as UsersIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/avatar'
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
import { useGetClassRoomsQuery } from '../store/classRoomsApi'
import { useDeleteUserMutation, useGetUsersQuery } from '../store/usersApi'

const Users = () => {
  const { t } = useTranslation()
  const { info } = useAuth()
  const { data: users = [], isLoading } = useGetUsersQuery()
  const { data: classRooms = [] } = useGetClassRoomsQuery()
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation()
  const [search, setSearch] = useState('')
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null)

  const classRoomNameById = useMemo(() => new Map(classRooms.map((c) => [c.id, c.name])), [classRooms])

  const query = search.toLowerCase()
  const filtered = users.filter((u) => u.fullName.toLowerCase().includes(query) || u.childName.toLowerCase().includes(query) || u.phoneNumber.includes(search))

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await deleteUser(toDelete.id).unwrap()
      notify.success(t('toasts.userDeleted'))
    } catch {
      return
    }
    setToDelete(null)
  }

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={t('users.title')}
        actions={
          <>
            {info?.role === 'SuperAdmin' && (
              <Button asChild variant="outline">
                <Link to="/users/create-employee">
                  <Plus />
                  {t('common.addEmployee')}
                </Link>
              </Button>
            )}
            <Button asChild>
              <Link to="/users/create">
                <Plus />
                {t('common.createUser')}
              </Link>
            </Button>
          </>
        }
      />

      <Card className="gap-4 overflow-hidden pb-0">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{t('users.title')}</CardTitle>
            <Badge variant="secondary" className="tabular-nums">
              {filtered.length}
            </Badge>
          </div>
          <SearchInput value={search} onChange={setSearch} />
        </CardHeader>
        <CardContent className="border-t px-0">
          {isLoading ? (
            <Skeleton className="m-6 h-72" />
          ) : filtered.length === 0 ? (
            <EmptyState icon={UsersIcon} title={t('common.noData')} className="m-6 border-0" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t('users.fullName')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('users.childName')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('classrooms.title')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('auth.phone')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('users.connect')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={user.fullName} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{user.fullName}</p>
                          <p className="truncate text-xs text-muted-foreground sm:hidden">{user.childName}</p>
                          <p className="hidden truncate text-xs text-muted-foreground sm:block">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{user.childName}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{classRoomNameById.get(user.classRoomId ?? -1) ?? t('common.noData')}</Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">{user.phoneNumber}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.connect ? (
                        <Badge variant="success">
                          <Check aria-hidden="true" />
                          <span className="sr-only">{t('users.connect')}</span>
                        </Badge>
                      ) : (
                        <Minus aria-hidden="true" className="size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link to={`/users/${user.id}`} aria-label={t('users.userDetails')} title={t('users.userDetails')}>
                            <Eye />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link to={`/update-user/${user.id}`} aria-label={t('common.edit')} title={t('common.edit')}>
                            <Edit />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          aria-label={t('common.delete')}
                          title={t('common.delete')}
                          onClick={() => setToDelete({ id: user.id, name: user.fullName })}
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

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t('confirm.deleteUserTitle')}
        description={t('confirm.deleteUserDescription', { name: toDelete?.name })}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </section>
  )
}

export default Users
