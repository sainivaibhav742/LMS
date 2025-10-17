import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentProgress() {
  const [courses, setCourses] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchProgressData = async () => {
      try {
        const response = await axios.get('/api/courses', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCourses(response.data)

        // Calculate analytics
        const totalCourses = response.data.length
        const completedCourses = response.data.filter(c => c.progress === 100).length
        const avgProgress = response.data.reduce((sum, c) => sum + c.progress, 0) / totalCourses
        const totalTimeSpent = response.data.reduce((sum, c) => sum + (c.timeSpent || 0), 0)
        const quizScores = [85, 92, 78, 96, 88] // Mock quiz scores

        setAnalytics({
          totalCourses,
          completedCourses,
          avgProgress: Math.round(avgProgress),
          totalTimeSpent,
          quizScores,
          weeklyProgress: [20, 35, 45, 60, 75, 85, 95] // Mock weekly progress data
        })
      } catch (err) {
        console.error('Failed to fetch progress data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProgressData()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="My Progress" />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">My Progress & Analytics</h1>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.totalCourses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{analytics.completedCourses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Avg Progress</h3>
            <p className="text-3xl font-bold text-purple-600">{analytics.avgProgress}%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Time Spent</h3>
            <p className="text-3xl font-bold text-orange-600">{Math.round(analytics.totalTimeSpent / 60)}h</p>
          </div>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Weekly Progress</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.weeklyProgress?.map((progress, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${progress}%` }}
                  ></div>
                  <span className="text-xs mt-2">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Performance */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Quiz Performance</h3>
            <div className="space-y-3">
              {analytics.quizScores?.map((score, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-20 text-sm">Quiz {index + 1}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-sm font-semibold">{score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Progress Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6">Course Progress Details</h3>
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{course.title}</h4>
                    <p className="text-gray-600">{course.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{course.progress}%</p>
                    <p className="text-sm text-gray-500">Complete</p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Lessons Completed</p>
                    <p className="font-semibold">{Math.round(course.progress / 10)} / 10</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time Spent</p>
                    <p className="font-semibold">{course.timeSpent || Math.floor(Math.random() * 20) + 5}h</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Accessed</p>
                    <p className="font-semibold">{course.lastAccessed || '2 days ago'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Next Milestone</p>
                    <p className="font-semibold">Lesson {Math.round(course.progress / 10) + 1}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
