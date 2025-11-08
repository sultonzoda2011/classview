import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { Edit, Eye, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getCenters } from '../api/centerApi'
import { getClassrooms } from '../api/classRoomApi'
import { deleteUser, getUsers } from '../api/usersApi'
import type { AppDispatch, RootState } from '../store/store'

const Users: React.FC = () => {
  const { users } = useSelector((state: RootState) => state.users)
  const { classrooms } = useSelector((state: RootState) => state.classRoom)
  const token = Cookies.get('token')
  const info = jwtDecode<{ role: string }>(token || '')
  const dispatch: AppDispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(getUsers())
    dispatch(getClassrooms())
    dispatch(getCenters())
  }, [dispatch])

  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.childName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm),
  )

  return (
    <section className="sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
          {t('common.manage')} {t('users.title')}
        </h1>
        <div className="flex flex-nowrap gap-2">
          {info.role === 'SuperAdmin' && (
            <Link
              to="/users/create-employee"
              className="bg-[#3b82f6] text-white px-4 py-2 rounded-lg shadow-md hover:from-gray-800 hover:to-black transition"
            >
              + {t('common.addEmployee')}
            </Link>
          )}
          <Link
            to="/users/create"
            className="bg-[#3b82f6] text-white px-4 py-2 rounded-lg shadow-md hover:from-gray-800 hover:to-black transition"
          >
            + {t('common.createUser')}
          </Link>
        </div>
      </div>

      <div className="mb-6 w-full sm:w-1/2 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={t('common.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-auto max-h-[70vh] transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-xs sm:text-sm min-w-full">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                {[
                  t('users.fullName'),
                  t('users.childName'),
                  t('classrooms.title'),
                  t('common.actions'),
                ].map((header) => (
                  <th
                    key={header}
                    className="px-2 sm:px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider break-words"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-2 sm:px-4 py-2 break-words text-gray-900 dark:text-gray-100">
                      {user.fullName}
                    </td>
                    <td className="px-2 sm:px-4 py-2 break-words text-gray-900 dark:text-gray-100">
                      {user.childName}
                    </td>
                    <td className="px-2 sm:px-4 py-2 break-words text-gray-900 dark:text-gray-100">
                      {classrooms.find((c) => c.id === user.classRoomId)?.name ||
                        t('common.noData')}
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      <div className="flex justify-center gap-2 sm:gap-3">
                        <Link
                          className="text-green-500 hover:text-green-700 dark:hover:text-green-400 transition"
                          to={`/users/${user.id}`}
                          title={t('users.userDetails')}
                        >
                          <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                        </Link>
                        <Link
                          className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition"
                          to={`/update-user/${user.id}`}
                          title={t('common.edit')}
                        >
                          <Edit className="w-4 sm:w-5 h-4 sm:h-5" />
                        </Link>
                        <button
                          onClick={() => dispatch(deleteUser(user.id))}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-400 dark:text-gray-500 transition"
                  >
                    {t('common.noData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Users
