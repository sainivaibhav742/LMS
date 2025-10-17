import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentDashboard() {
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState({ enrolled: 0, completed: 0, progress: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCourses(response.data)
        const enrolled = response.data.length
        const completed = response.data.filter(c => c.progress === 100).length
        const avgProgress = response.data.reduce((sum, c) => sum + c.progress, 0) / enrolled
        setStats({ enrolled, completed, progress: Math.round(avgProgress) })
      } catch (err) {
        console.error('Failed to fetch courses', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="Dashboard" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hello, John Doe!</h1>
          <p className="text-gray-600">Welcome back to your learning dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Enrolled Courses</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.enrolled}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Completed Courses</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.progress}%</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recently Accessed Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
                <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded mb-4" />
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
                <p className="text-gray-600 mb-4">{course.progress}% Complete</p>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                  Continue Learning
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm text-gray-600">New course "Advanced JavaScript" is now available!</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-gray-600">You completed "React Basics" course. Certificate available!</p>
              <p className="text-xs text-gray-400">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
