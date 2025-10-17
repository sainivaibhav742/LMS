import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function InstructorDashboard() {
  const [stats, setStats] = useState({})
  const [courses, setCourses] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'instructor') {
      router.push('/login')
      return
    }

    const fetchDashboardData = async () => {
      try {
        // Mock dashboard data - in real app, this would come from API
        const mockStats = {
          totalCourses: 8,
          totalStudents: 1247,
          totalRevenue: 18950.00,
          avgRating: 4.7,
          completionRate: 78.5
        }

        const mockCourses = [
          {
            id: 1,
            title: 'Advanced React Development',
            students: 234,
            rating: 4.8,
            revenue: 4680.00,
            status: 'active',
            lastUpdated: '2023-05-15'
          },
          {
            id: 2,
            title: 'Python for Data Science',
            students: 189,
            rating: 4.9,
            revenue: 3771.00,
            status: 'active',
            lastUpdated: '2023-05-14'
          },
          {
            id: 3,
            title: 'UI/UX Design Fundamentals',
            students: 145,
            rating: 4.7,
            revenue: 2175.00,
            status: 'draft',
            lastUpdated: '2023-05-10'
          }
        ]

        const mockActivity = [
          {
            id: 1,
            type: 'enrollment',
            message: 'New student enrolled in "Advanced React Development"',
            time: '2 hours ago'
          },
          {
            id: 2,
            type: 'review',
            message: '5-star review received for "Python for Data Science"',
            time: '4 hours ago'
          },
          {
            id: 3,
            type: 'discussion',
            message: 'New question posted in course discussion',
            time: '6 hours ago'
          },
          {
            id: 4,
            type: 'completion',
            message: '15 students completed "UI/UX Design Fundamentals"',
            time: '1 day ago'
          }
        ]

        setStats(mockStats)
        setCourses(mockCourses)
        setRecentActivity(mockActivity)
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="instructor" active="Dashboard" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your courses and students.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalCourses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalStudents.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Avg Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">⭐ {stats.avgRating}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.completionRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Courses */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Courses</h2>
                <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                  Create Course
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex-1">
                      <h3 className="font-semibold">{course.title}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>{course.students} students</span>
                        <span>⭐ {course.rating}</span>
                        <span>${course.revenue}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        course.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'enrollment' ? 'bg-green-500' :
                      activity.type === 'review' ? 'bg-yellow-500' :
                      activity.type === 'discussion' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold">Create Course</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold">View Students</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-semibold">Discussions</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Analytics</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
