import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { Clock, Layers, Lock, Phone, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getClassrooms } from '../api/classRoomApi'
import { getUserById } from '../api/usersApi'
import ChangePasswordModal from '../components/modal/changePasswordModal'
import type { AppDispatch, RootState } from '../store/store'
import type { CustomJwtPayload } from '../types/jwt'

const Profile = () => {
  const token = Cookies.get('token')
  const info = useMemo(() => (token ? jwtDecode<CustomJwtPayload>(token) : null), [token])
  const { t } = useTranslation()

  const dispatch: AppDispatch = useDispatch()
  const { usersById } = useSelector((state: RootState) => state.users)
  const { classrooms } = useSelector((state: RootState) => state.classRoom)

  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)

  useEffect(() => {
    if (info?.nameid) dispatch(getUserById(info.nameid))
    dispatch(getClassrooms())
  }, [dispatch, info?.nameid])

  if (!usersById) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-400">
        {t('pages.profile.userNotFound')}
      </div>
    )
  }

  const { fullName, childName, phoneNumber, startTime, endTime, classRoomId } = usersById
  const classroom = classrooms.find((cl) => cl.id === classRoomId)

  return (
    <section className="min-h-screen p-6 sm:p-10 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <span className="w-24 h-24 flex items-center justify-center text-3xl font-semibold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
              {fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
              {fullName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 sm:text-lg">{t('users.role')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400 dark:text-gray-300">
                  {t('pages.profile.info.childName')}
                </p>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-100">{childName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400 dark:text-gray-300">{t('auth.phone')}</p>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {phoneNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400 dark:text-gray-300">
                  {t('pages.profile.info.startTime')}
                </p>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {startTime} — {endTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400 dark:text-gray-300">
                  {t('pages.profile.info.classroom')}
                </p>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {classroom ? classroom.name : t('common.noData')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setChangePasswordModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-colors shadow-md"
          >
            <Lock className="w-5 h-5" />
            {t('auth.changePassword')}
          </button>
        </div>
      </div>

      <ChangePasswordModal
        changePasswordModalOpen={changePasswordModalOpen}
        setChangePasswordModalOpen={setChangePasswordModalOpen}
      />
    </section>
  )
}

export default Profile
