import { zodResolver } from '@hookform/resolvers/zod'
import { Video } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SelectField } from '../fields/select-field'
import { TextField } from '../fields/text-field'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form } from '../ui/form'
import { notify } from '../../lib/notify'
import { useGetCentersQuery } from '../../store/centersApi'
import { useCreateClassRoomMutation, useUpdateClassRoomMutation } from '../../store/classRoomsApi'
import { classRoomSchema, type ClassRoomFormInput, type IClassRoom } from '../../types/classRoom'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  classRoom?: IClassRoom | null
  /** Если центр администратора фиксирован — поле центра скрывается */
  fixedCenterId?: number
}

/** Один диалог на создание и редактирование класса. */
const ClassroomFormDialog = ({ open, onOpenChange, classRoom, fixedCenterId }: Props) => {
  const { t } = useTranslation()
  const isEdit = !!classRoom
  const { data: centers = [] } = useGetCentersQuery()
  const [createClassRoom, { isLoading: creating }] = useCreateClassRoomMutation()
  const [updateClassRoom, { isLoading: updating }] = useUpdateClassRoomMutation()

  const form = useForm<ClassRoomFormInput>({
    resolver: zodResolver(useMemo(() => classRoomSchema(t), [t])),
    defaultValues: { name: '', cameraUrl: '', centerId: fixedCenterId ?? 0 },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: classRoom?.name ?? '',
        cameraUrl: classRoom?.cameraUrl ?? '',
        centerId: classRoom?.centerId ?? fixedCenterId ?? 0,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, classRoom, fixedCenterId])

  const onSubmit = async (data: ClassRoomFormInput) => {
    try {
      if (isEdit) {
        await updateClassRoom({ id: classRoom.id, ...data }).unwrap()
        notify.success(t('toasts.classroomUpdated'))
      } else {
        await createClassRoom(data).unwrap()
        notify.success(t('toasts.classroomCreated'))
      }
    } catch {
      return
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('classrooms.updateClassroom') : t('classrooms.createClassroom')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TextField control={form.control} name="name" label={t('classrooms.name')} placeholder={t('classrooms.name')} />
            <TextField
              control={form.control}
              name="cameraUrl"
              label={t('classrooms.cameraUrl')}
              placeholder="rtsp://login:pass@192.168.1.10:554/stream"
              icon={Video}
            />
            {!fixedCenterId && (
              <SelectField
                control={form.control}
                name="centerId"
                label={t('classrooms.center')}
                placeholder={t('classrooms.center')}
                options={centers.map((c) => ({ value: String(c.id), label: c.name }))}
              />
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" loading={creating || updating}>
                {isEdit ? t('common.save') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ClassroomFormDialog
