import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function InstructorCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'instructor') {
      router.push('/login')
      return
    }

    const fetchCourses = async () => {
      try {
        // Mock courses data - in real app, this would come from API
        const mockCourses = [
          {
            id: 1,
            title: 'Advanced React Development',
            category: 'Web Development',
            students: 234,
            rating: 4.8,
            reviews: 89,
            revenue: 4680.00,
            status: 'published',
            lastUpdated: '2023-05-15',
            thumbnail: 'https://via.placeholder.com/300x200?text=React+Advanced',
            description: 'Master advanced React concepts including hooks, context, and performance optimization.',
            modules: 12,
            duration: '8 weeks',
            level: 'Advanced'
          },
          {
            id: 2,
            title: 'Python for Data Science',
            category: 'Data Science',
            students: 189,
            rating: 4.9,
            reviews: 67,
            revenue: 3771.00,
            status: 'published',
            lastUpdated: '2023-05-14',
            thumbnail: 'https://via.placeholder.com/300x200?text=Python+Data+Science',
            description: 'Learn Python programming for data analysis, visualization, and machine learning.',
            modules: 15,
            duration: '12 weeks',
            level: 'Intermediate'
          },
          {
            id: 3,
            title: 'UI/UX Design Fundamentals',
            category: 'Design',
            students: 0,
            rating: 0,
            reviews: 0,
            revenue: 0.00,
            status: 'draft',
            lastUpdated: '2023-05-10',
            thumbnail: 'https://via.placeholder.com/300x200?text=UI+UX+Design',
            description: 'Learn the principles of user interface and user experience design.',
            modules: 8,
            duration: '6 weeks',
            level: 'Beginner'
          }
        ]

        setCourses(mockCourses)
      } catch (err) {
        console.error('Failed to fetch courses', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [router])

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'all') return true
    if (activeTab === 'published') return course.status === 'published'
    if (activeTab === 'drafts') return course.status === 'draft'
    return true
  })

  const handleEditCourse = (courseId) => {
    // In real app, this would navigate to course editor
    alert(`Edit course ${courseId}`)
  }

  const handleDeleteCourse = (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId))
    }
  }

  const handlePublishCourse = (courseId) => {
    setCourses(courses.map(course =>
      course.id === courseId
        ? { ...course, status: 'published' }
        : course
    ))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="instructor" active="Courses" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Courses</h1>
              <p className="text-gray-600">Manage and create your course content</p>
            </div>
            <button className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-semibold">
              Create New Course
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'all', label: 'All Courses', count: courses.length },
                { id: 'published', label: 'Published', count: courses.filter(c => c.status === 'published').length },
                { id: 'drafts', label: 'Drafts', count: courses.filter(c => c.status === 'draft').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {course.category}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    course.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{course.modules} modules</span>
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                </div>

                {course.status === 'published' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="font-semibold">{course.rating}</span>
                        <span className="text-gray-500 ml-1">({course.reviews})</span>
                      </div>
                      <span className="text-gray-500">{course.students} students</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Revenue: ${course.revenue}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCourse(course.id)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 text-sm font-semibold"
                  >
                    Edit
                  </button>
                  {course.status === 'draft' && (
                    <button
                      onClick={() => handlePublishCourse(course.id)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-sm font-semibold"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'drafts'
                ? "You don't have any draft courses yet."
                : "You haven't published any courses yet."
              }
            </p>
            <button className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-semibold">
              Create Your First Course
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
