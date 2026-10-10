import { Edit, MapPin, Trash } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { notify } from '../lib/notify'
import { useDeleteCenterMutation } from '../store/centersApi'
import type { ICenter } from '../types/center'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { ConfirmDialog } from './ui/confirm-dialog'

interface Props {
  center: ICenter
  onEdit: (center: ICenter) => void
}

const CenterCard = ({ center, onEdit }: Props) => {
  const { t } = useTranslation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteCenter, { isLoading }] = useDeleteCenterMutation()

  const handleDelete = async () => {
    try {
      await deleteCenter(center.id).unwrap()
      notify.success(t('toasts.centerDeleted'))
    } catch {
      return
    }
    setConfirmOpen(false)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-36 sm:h-44">
        <img
          src="https://images.adsttc.com/media/images/5b70/1438/f197/cc5a/2c00/0a09/newsletter/exterior_view-1.jpg?1534071815="
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <h2 className="text-white text-lg sm:text-xl font-bold truncate">{center.name}</h2>
        </div>
      </div>
      <CardContent className="pt-4 flex flex-col gap-3">
        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm gap-2 truncate">
          <MapPin size={16} className="text-red-500 flex-shrink-0" />
          <span className="truncate">{center.address}</span>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="destructive" size="icon" onClick={() => setConfirmOpen(true)} aria-label={t('common.delete')}>
            <Trash size={18} />
          </Button>
          <Button size="icon" onClick={() => onEdit(center)} aria-label={t('common.edit')}>
            <Edit size={18} />
          </Button>
        </div>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('confirm.deleteCenterTitle')}
        description={t('confirm.deleteCenterDescription', { name: center.name })}
        onConfirm={handleDelete}
        loading={isLoading}
      />
    </Card>
  )
}

export default CenterCard
