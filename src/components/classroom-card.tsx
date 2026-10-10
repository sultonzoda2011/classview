import { Edit, MapPin, Trash, Video } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { notify } from '../lib/notify'
import { useDeleteClassRoomMutation } from '../store/classRoomsApi'
import type { IClassRoom } from '../types/classRoom'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { ConfirmDialog } from './ui/confirm-dialog'

interface Props {
  classRoom: IClassRoom
  centerName: string
  onEdit: (classRoom: IClassRoom) => void
}

const ClassroomCard = ({ classRoom, centerName, onEdit }: Props) => {
  const { t } = useTranslation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteClassRoom, { isLoading }] = useDeleteClassRoomMutation()

  const handleDelete = async () => {
    try {
      await deleteClassRoom(classRoom.id).unwrap()
      notify.success(t('toasts.classroomDeleted'))
    } catch {
      return
    }
    setConfirmOpen(false)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-36 sm:h-44">
        <img src="https://modelteaching.com/wp-content/uploads/2019/04/Classroom-Procedures-min.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <h2 className="text-white text-lg sm:text-xl font-bold truncate">{classRoom.name}</h2>
        </div>
      </div>
      <CardContent className="pt-4 flex flex-col gap-2">
        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm gap-2 truncate">
          <MapPin size={16} className="text-blue-500 flex-shrink-0" />
          <span className="truncate">{centerName || t('common.noData')}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm gap-2 truncate">
          <Video size={16} className="text-green-500 flex-shrink-0" />
          <span className="truncate">{classRoom.cameraUrl}</span>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="destructive" size="icon" onClick={() => setConfirmOpen(true)} aria-label={t('common.delete')}>
            <Trash size={18} />
          </Button>
          <Button size="icon" onClick={() => onEdit(classRoom)} aria-label={t('common.edit')}>
            <Edit size={18} />
          </Button>
        </div>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('confirm.deleteClassroomTitle')}
        description={t('confirm.deleteClassroomDescription', { name: classRoom.name })}
        onConfirm={handleDelete}
        loading={isLoading}
      />
    </Card>
  )
}

export default ClassroomCard
