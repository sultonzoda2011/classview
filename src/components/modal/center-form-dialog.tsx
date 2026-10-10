import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TextField } from '../fields/text-field'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form } from '../ui/form'
import { notify } from '../../lib/notify'
import { useCreateCenterMutation, useUpdateCenterMutation } from '../../store/centersApi'
import { centerSchema, type CenterFormInput, type ICenter } from '../../types/center'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Если передан — режим редактирования, иначе создание нового центра */
  center?: ICenter | null
}

/** Один диалог на создание и редактирование центра — вместо двух отдельных модалок. */
const CenterFormDialog = ({ open, onOpenChange, center }: Props) => {
  const { t } = useTranslation()
  const isEdit = !!center
  const [createCenter, { isLoading: creating }] = useCreateCenterMutation()
  const [updateCenter, { isLoading: updating }] = useUpdateCenterMutation()

  const form = useForm<CenterFormInput>({
    resolver: zodResolver(useMemo(() => centerSchema(t), [t])),
    defaultValues: { name: '', address: '' },
  })

  useEffect(() => {
    if (open) form.reset({ name: center?.name ?? '', address: center?.address ?? '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, center])

  const onSubmit = async (data: CenterFormInput) => {
    try {
      if (isEdit) {
        await updateCenter({ id: center.id, ...data }).unwrap()
        notify.success(t('toasts.centerUpdated'))
      } else {
        await createCenter(data).unwrap()
        notify.success(t('toasts.centerCreated'))
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
          <DialogTitle>{isEdit ? t('centers.updateCenter') : t('centers.createCenter')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TextField control={form.control} name="name" label={t('centers.name')} placeholder={t('centers.name')} />
            <TextField control={form.control} name="address" label={t('centers.address')} placeholder={t('centers.address')} />
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

export default CenterFormDialog
