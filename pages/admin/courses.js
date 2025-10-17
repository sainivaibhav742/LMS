import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedInstructor, setSelectedInstructor] = useState('all')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'admin') {
      router.push('/login')
      return
    }

    const fetchCoursesData = async () => {
      try {
        // Mock courses data - in real app, this would come from API
        const mockCourses = [
          {
            id: 1,
            title: 'Advanced React Development',
            category: 'Web Development',
            instructor: 'Dr. Sarah Johnson',
            instructorId: 1,
            students: 234,
            rating: 4.8,
            reviews: 89,
            revenue: 4680.00,
            status: 'published',
            price: 199.99,
            lastUpdated: '2023-05-15',
            thumbnail: 'https://via.placeholder.com/300x200?text=React+Advanced'
          },
          {
            id: 2,
            title: 'Python for Data Science',
            category: 'Data Science',
            instructor: 'Dr. Michael Chen',
            instructorId: 2,
            students: 189,
            rating: 4.9,
            reviews: 67,
            revenue: 3771.00,
            status: 'published',
            price: 249.99,
            lastUpdated: '2023-05-14',
            thumbnail: 'https://via.placeholder.com/300x200?text=Python+Data+Science'
          },
          {
            id: 3,
            title: 'UI/UX Design Fundamentals',
            category: 'Design',
            instructor: 'Dr. Sarah Johnson',
            instructorId: 1,
            students: 145,
            rating: 4.7,
            reviews: 45,
            revenue: 2175.00,
            status: 'published',
            price: 149.99,
            lastUpdated: '2023-05-10',
            thumbnail: 'https://via.placeholder.com/300x200?text=UI+UX+Design'
          },
          {
            id: 4,
            title: 'Machine Learning Basics',
            category: 'Data Science',
            instructor: 'Dr. Emily Rodriguez',
            instructorId: 3,
            students: 0,
            rating: 0,
            reviews: 0,
            revenue: 0.00,
            status: 'pending_review',
            price: 299.99,
            lastUpdated: '2023-05-12',
            thumbnail: 'https://via.placeholder.com/300x200?text=Machine+Learning'
          },
          {
            id: 5,
            title: 'Cloud Computing with AWS',
            category: 'Cloud Computing',
            instructor: 'Prof. David Kim',
            instructorId: 4,
            students: 0,
            rating: 0,
            reviews: 0,
            revenue: 0.00,
            status: 'draft',
            price: 349.99,
            lastUpdated: '2023-05-08',
            thumbnail: 'https://via.placeholder.com/300x200?text=AWS+Cloud'
          }
        ]

        const mockInstructors = [
          { id: 'all', name: 'All Instructors' },
          { id: 1, name: 'Dr. Sarah Johnson' },
          { id: 2, name: 'Dr. Michael Chen' },
          { id: 3, name: 'Dr. Emily Rodriguez' },
          { id: 4, name: 'Prof. David Kim' }
        ]

        setCourses(mockCourses)
        setInstructors(mockInstructors)
      } catch (err) {
        console.error('Failed to fetch courses data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCoursesData()
  }, [router])

  const filteredCourses = courses.filter(course => {
    const statusMatch = activeTab === 'all' ||
                       (activeTab === 'published' && course.status === 'published') ||
                       (activeTab === 'pending' && course.status === 'pending_review') ||
                       (activeTab === 'drafts' && course.status === 'draft')

    const instructorMatch = selectedInstructor === 'all' || course.instructorId.toString() === selectedInstructor

    return statusMatch && instructorMatch
  })

  const handleApproveCourse = (courseId) => {
    setCourses(courses.map(course =>
      course.id === courseId
        ? { ...course, status: 'published' }
        : course
    ))
  }

  const handleRejectCourse = (courseId) => {
    if (confirm('Are you sure you want to reject this course?')) {
      setCourses(courses.filter(course => course.id !== courseId))
    }
  }

  const handleDeleteCourse = (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId))
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      pending_review: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' }
    }
    const config = statusConfig[status] || statusConfig.draft
    return <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>{config.label}</span>
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="admin" active="Manage Courses" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Course Management</h1>
              <p className="text-gray-600">Review, approve, and manage all courses on the platform</p>
            </div>
            <button className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-semibold">
              Add New Course
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Published</h3>
            <p className="text-3xl font-bold text-green-600">
              {courses.filter(c => c.status === 'published').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Pending Review</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {courses.filter(c => c.status === 'pending_review').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">
              ${courses.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All Courses', count: courses.length },
                  { id: 'published', label: 'Published', count: courses.filter(c => c.status === 'published').length },
                  { id: 'pending', label: 'Pending Review', count: courses.filter(c => c.status === 'pending_review').length },
                  { id: 'drafts', label: 'Drafts', count: courses.filter(c => c.status === 'draft').length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructor:</label>
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-12 w-12 rounded object-cover mr-4" src={course.thumbnail} alt={course.title} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.rating > 0 ? `⭐ ${course.rating} (${course.reviews})` : 'No reviews'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${course.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(course.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      {course.status === 'pending_review' && (
                        <>
                          <button
                            onClick={() => handleApproveCourse(course.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectCourse(course.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more courses.</p>
          </div>
        )}
      </div>
    </div>
  )
}
