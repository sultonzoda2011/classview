import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, User } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { sendOtpApi } from '../../api/send-otpApi'
import type { AppDispatch } from '../../store/store'
import { sendOtpSchema, type SendOtpInput } from '../../types/otp'
import FormInput from '../formInput'

interface ISendOtpModalProps {
  sendOtpModal: boolean
  setSendOtpModal: React.Dispatch<React.SetStateAction<boolean>>
  onOpenVerify: () => void
}

const SendOtpModal = ({ sendOtpModal, setSendOtpModal, onOpenVerify }: ISendOtpModalProps) => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendOtpInput>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: {
      phone: '',
    },
  })

  const dispatch: AppDispatch = useDispatch()

  if (!sendOtpModal) return null

  const onSubmit = (data: SendOtpInput) => {
    localStorage.setItem('phoneNumber', data.phone)
    dispatch(sendOtpApi({ phoneNumber: data.phone }))
    reset()
    setSendOtpModal(false)
    onOpenVerify()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-xl p-6 sm:p-8 flex flex-col items-center animate-fadeIn mx-2 sm:mx-0">
        <CheckCircle className="text-green-500 w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold text-center text-green-700 dark:text-green-400 mb-2">
          {t('modals.sendOtp.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          {t('modals.sendOtp.description')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          <FormInput
            name="phone"
            placeholder={t('modals.sendOtp.phonePlaceholder')}
            type="text"
            control={control}
            icon={User}
            error={errors.phone}
          />

          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={() => setSendOtpModal(false)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-900 dark:hover:bg-white/90 font-medium transition"
            >
              {t('modals.sendOtp.sendCode')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SendOtpModal
