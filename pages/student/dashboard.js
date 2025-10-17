import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import axios from 'axios'

export default function StudentDashboard() {
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState({ enrolled: 0, completed: 0, progress: 0 })
  const [loading, setLoading] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
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

  if (loading) {
    return (
      <div className="flex bg-neutral-50 min-h-screen">
        <Sidebar role="student" active="Dashboard" isCollapsed={isSidebarCollapsed} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar role="student" active="Dashboard" isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <Header role="student" userName="John Doe" onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <div className="flex-1 p-8 bg-gradient-to-br from-purple-50 to-pink-50">

          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
                  <p className="text-purple-100 text-lg">Ready to continue your learning journey?</p>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🎓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Enrolled Courses</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.enrolled}</p>
                  <p className="text-sm text-gray-500 mt-1">Active learning paths</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Completed Courses</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                  <p className="text-sm text-gray-500 mt-1">Achievements unlocked</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Overall Progress</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats.progress}%</p>
                  <p className="text-sm text-gray-500 mt-1">Average completion</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Accessed Courses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Continue Learning</h2>
              <button className="btn-outline text-sm">
                View All Courses
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="relative mb-4">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded-lg" />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      {course.progress}% Complete
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{course.category}</span>
                    <span>Last accessed 2 days ago</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                    Continue Learning
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Completed "React Components" lesson</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Earned certificate for "JavaScript Basics"</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Started new course "Advanced CSS"</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Mark all read
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📚</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New course "Advanced JavaScript" is now available!</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">🏆</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Congratulations! You completed "React Basics" course.</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">⭐</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">You received a 5-star review from your instructor!</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
