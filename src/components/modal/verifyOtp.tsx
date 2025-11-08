import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Lock } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { verifyOtpApi } from '../../api/verify-otpApi'
import type { AppDispatch } from '../../store/store'
import { verifyOtpSchema, type VerifyOtpInput } from '../../types/otp'
import FormInput from '../formInput'

interface IVerifyOtpProps {
  verifyOtpModal: boolean
  setVerifyOtpModal: React.Dispatch<React.SetStateAction<boolean>>
  onOpenReset: () => void
}

const VerifyOtp = ({ verifyOtpModal, setVerifyOtpModal, onOpenReset }: IVerifyOtpProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otpCode: '' },
  })
  const [timeLeft, setTimeLeft] = useState(180)
  const otpInputRef = useRef<HTMLInputElement>(null)
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    if (!verifyOtpModal) return
    setTimeLeft(180)
    otpInputRef.current?.focus()

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [verifyOtpModal])

  if (!verifyOtpModal) return null

  const onSubmit = (data: VerifyOtpInput) => {
    const phoneNumber = localStorage.getItem('phoneNumber')
    if (!phoneNumber) {
      alert('Ошибка: номер телефона не найден.')
      return
    }

    dispatch(
      verifyOtpApi({
        phoneNumber,
        otpCode: data.otpCode,
      }),
    )
    reset()
    setVerifyOtpModal(false)
    onOpenReset()
  }

  const resendOtp = () => {
    setTimeLeft(180)
    alert('Новый код OTP отправлен!')
    otpInputRef.current?.focus()
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-xl p-6 sm:p-8 flex flex-col items-center animate-fadeIn mx-2 sm:mx-0">
        <CheckCircle className="text-green-500 w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold text-center text-green-700 dark:text-green-400 mb-2">
          Подтверждение OTP
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Введите код OTP, который вы получили на телефон
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          <FormInput
            name="otpCode"
            placeholder="Код OTP"
            type="text"
            control={control}
            icon={Lock}
            error={errors.otpCode}
          />

          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Время на ввод: {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </div>

          <div className="flex justify-between mt-2 w-full">
            <button
              type="button"
              onClick={() => setVerifyOtpModal(false)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
            >
              Закрыть
            </button>

            <div className="flex gap-2">
              {timeLeft === 0 && (
                <button
                  type="button"
                  onClick={resendOtp}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium"
                >
                  Новый код
                </button>
              )}

              <button
                type="submit"
                disabled={timeLeft === 0}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  timeLeft === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-white/90'
                }`}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyOtp
