import { Edit, Eye, Plus, Trash2, Users as UsersIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SearchInput from '../components/search-input'
import { Button } from '../components/ui/button'
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

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.childName.toLowerCase().includes(search.toLowerCase()) ||
      u.phoneNumber.includes(search),
  )

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
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          {t('common.manage')} {t('users.title')}
        </h1>
        <div className="flex flex-wrap gap-2">
          {info?.role === 'SuperAdmin' && (
            <Button asChild variant="secondary">
              <Link to="/users/create-employee">
                <Plus className="h-4 w-4" />
                {t('common.addEmployee')}
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link to="/users/create">
              <Plus className="h-4 w-4" />
              {t('common.createUser')}
            </Link>
          </Button>
        </div>
      </div>

      <SearchInput value={search} onChange={setSearch} />

      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : filtered.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('users.fullName')}</TableHead>
              <TableHead>{t('users.childName')}</TableHead>
              <TableHead>{t('classrooms.title')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.childName}</TableCell>
                <TableCell>{classRoomNameById.get(user.classRoomId ?? -1) ?? t('common.noData')}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/users/${user.id}`} title={t('users.userDetails')}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/update-user/${user.id}`} title={t('common.edit')}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={() => setToDelete({ id: user.id, name: user.fullName })}
                      title={t('common.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState icon={UsersIcon} title={t('common.noData')} />
      )}

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
