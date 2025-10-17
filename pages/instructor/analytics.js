import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function InstructorAnalytics() {
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'instructor') {
      router.push('/login')
      return
    }

    const fetchAnalytics = async () => {
      try {
        // Mock analytics data - in real app, this would come from API
        const mockAnalytics = {
          overview: {
            totalStudents: 1247,
            totalRevenue: 18950.00,
            avgRating: 4.7,
            completionRate: 78.5
          },
          enrollmentTrends: [
            { month: 'Jan', enrollments: 45 },
            { month: 'Feb', enrollments: 67 },
            { month: 'Mar', enrollments: 89 },
            { month: 'Apr', enrollments: 123 },
            { month: 'May', enrollments: 156 }
          ],
          revenueTrends: [
            { month: 'Jan', revenue: 900 },
            { month: 'Feb', revenue: 1340 },
            { month: 'Mar', revenue: 1780 },
            { month: 'Apr', revenue: 2460 },
            { month: 'May', revenue: 3120 }
          ],
          topCourses: [
            {
              id: 1,
              title: 'Advanced React Development',
              students: 234,
              revenue: 4680,
              rating: 4.8,
              completionRate: 82
            },
            {
              id: 2,
              title: 'Python for Data Science',
              students: 189,
              revenue: 3771,
              rating: 4.9,
              completionRate: 85
            },
            {
              id: 3,
              title: 'UI/UX Design Fundamentals',
              students: 145,
              revenue: 2175,
              rating: 4.7,
              completionRate: 78
            }
          ],
          studentEngagement: {
            activeStudents: 892,
            inactiveStudents: 355,
            avgSessionTime: '45 min',
            avgCoursesPerStudent: 1.8
          },
          recentReviews: [
            {
              id: 1,
              student: 'John Doe',
              course: 'Advanced React Development',
              rating: 5,
              comment: 'Excellent course! Very comprehensive and well-structured.',
              date: '2023-05-15'
            },
            {
              id: 2,
              student: 'Jane Smith',
              course: 'Python for Data Science',
              rating: 5,
              comment: 'Great content and practical examples. Highly recommended!',
              date: '2023-05-14'
            },
            {
              id: 3,
              student: 'Mike Johnson',
              course: 'UI/UX Design Fundamentals',
              rating: 4,
              comment: 'Good introduction to UI/UX principles. Could use more real-world examples.',
              date: '2023-05-12'
            }
          ]
        }

        setAnalytics(mockAnalytics)
      } catch (err) {
        console.error('Failed to fetch analytics', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="instructor" active="Analytics" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
          <p className="text-gray-600">Track your course performance and student engagement</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.overview?.totalStudents.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${analytics.overview?.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">+18% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Average Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">⭐ {analytics.overview?.avgRating}</p>
            <p className="text-sm text-gray-500 mt-1">Across all courses</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
            <p className="text-3xl font-bold text-purple-600">{analytics.overview?.completionRate}%</p>
            <p className="text-sm text-gray-500 mt-1">Students finishing courses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enrollment Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Enrollment Trends</h2>
            <div className="space-y-3">
              {analytics.enrollmentTrends?.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(data.enrollments / 200) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{data.enrollments}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
            <div className="space-y-3">
              {analytics.revenueTrends?.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(data.revenue / 4000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">${data.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Courses */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Top Performing Courses</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.topCourses?.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{course.title}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                        <span>{course.students} students</span>
                        <span>⭐ {course.rating}</span>
                        <span>{course.completionRate}% completion</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">${course.revenue}</div>
                      <div className="text-xs text-gray-500">revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Reviews</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.recentReviews?.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{review.student}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{review.course}</p>
                    <p className="text-sm text-gray-800">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Student Engagement */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Student Engagement</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.studentEngagement?.activeStudents}</div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{analytics.studentEngagement?.inactiveStudents}</div>
              <div className="text-sm text-gray-600">Inactive Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.studentEngagement?.avgSessionTime}</div>
              <div className="text-sm text-gray-600">Avg Session Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.studentEngagement?.avgCoursesPerStudent}</div>
              <div className="text-sm text-gray-600">Avg Courses/Student</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
