import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { User, Phone, Clock, Home, Edit, ArrowLeft } from 'lucide-react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import type { AppDispatch, RootState } from '../store/store'
import { getUserById } from '../api/usersApi'

const UserDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { usersById } = useSelector((state: RootState) => state.users)
  const { classrooms } = useSelector((state: RootState) => state.classRoom)
  const { centers } = useSelector((state: RootState) => state.center)

  useEffect(() => {
    if (id) dispatch(getUserById(id))
  }, [dispatch, id])

  const classRoomName = classrooms.find((c) => c.id === usersById?.classRoomId)?.name || '-'
  const centerName = centers.find((c) => c.id === usersById?.centerId)?.name || '-'

  const infoFields = [
    { label: 'Full Name', value: usersById?.fullName || '-', icon: User },
    { label: 'Child Name', value: usersById?.childName || '-', icon: User },
    { label: 'Phone', value: usersById?.phoneNumber || '-', icon: Phone },
    { label: 'Start Time', value: usersById?.startTime || '-', icon: Clock },
    { label: 'End Time', value: usersById?.endTime || '-', icon: Clock },
    { label: 'Class Room', value: classRoomName, icon: Home },
    { label: 'Center', value: centerName, icon: Home },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-800 dark:text-gray-200 hover:text-red-500 transition-colors flex items-center gap-2 font-medium"
      >
        <ArrowLeft size={24} /> Back
      </button>

      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-gray-100">
        User Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoFields.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all bg-white dark:bg-gray-800"
          >
            <Icon size={22} className="text-gray-600 dark:text-gray-300" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
              <p className="text-gray-500 dark:text-gray-400">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 dark:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <Link
          to={`/update-user/${usersById?.id}`}
          className="bg-black dark:bg-gray-900 flex items-center gap-2 text-white px-5 py-2 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Edit size={18} />
          Edit User
        </Link>
      </div>
    </div>
  )
}

export default UserDetails
