import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function InstructorStudents() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'instructor') {
      router.push('/login')
      return
    }

    const fetchStudentsData = async () => {
      try {
        // Mock courses data
        const mockCourses = [
          { id: 'all', title: 'All Courses' },
          { id: 1, title: 'Advanced React Development' },
          { id: 2, title: 'Python for Data Science' },
          { id: 3, title: 'UI/UX Design Fundamentals' }
        ]

        // Mock students data - in real app, this would come from API
        const mockStudents = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'https://via.placeholder.com/40x40?text=JD',
            courses: [
              {
                id: 1,
                title: 'Advanced React Development',
                progress: 85,
                enrolledDate: '2023-03-15',
                lastActivity: '2023-05-15',
                status: 'active'
              }
            ],
            totalProgress: 85,
            completedCourses: 0,
            certificates: 0
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            avatar: 'https://via.placeholder.com/40x40?text=JS',
            courses: [
              {
                id: 2,
                title: 'Python for Data Science',
                progress: 92,
                enrolledDate: '2023-02-20',
                lastActivity: '2023-05-14',
                status: 'active'
              },
              {
                id: 1,
                title: 'Advanced React Development',
                progress: 100,
                enrolledDate: '2023-01-10',
                lastActivity: '2023-04-20',
                status: 'completed'
              }
            ],
            totalProgress: 96,
            completedCourses: 1,
            certificates: 1
          },
          {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            avatar: 'https://via.placeholder.com/40x40?text=MJ',
            courses: [
              {
                id: 3,
                title: 'UI/UX Design Fundamentals',
                progress: 45,
                enrolledDate: '2023-04-01',
                lastActivity: '2023-05-10',
                status: 'active'
              }
            ],
            totalProgress: 45,
            completedCourses: 0,
            certificates: 0
          },
          {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            avatar: 'https://via.placeholder.com/40x40?text=SW',
            courses: [
              {
                id: 2,
                title: 'Python for Data Science',
                progress: 78,
                enrolledDate: '2023-03-05',
                lastActivity: '2023-05-12',
                status: 'active'
              }
            ],
            totalProgress: 78,
            completedCourses: 0,
            certificates: 0
          }
        ]

        setCourses(mockCourses)
        setStudents(mockStudents)
      } catch (err) {
        console.error('Failed to fetch students data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentsData()
  }, [router])

  const filteredStudents = students.filter(student => {
    if (selectedCourse === 'all') return true
    return student.courses.some(course => course.id.toString() === selectedCourse)
  })

  const handleViewStudent = (studentId) => {
    // In real app, this would navigate to student detail page
    alert(`View student ${studentId}`)
  }

  const handleMessageStudent = (studentId) => {
    // In real app, this would open messaging interface
    alert(`Message student ${studentId}`)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="instructor" active="Students" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Students</h1>
          <p className="text-gray-600">Track student progress and engagement across your courses</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600">{students.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Active Students</h3>
            <p className="text-3xl font-bold text-green-600">
              {students.filter(s => s.courses.some(c => c.status === 'active')).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Completed Courses</h3>
            <p className="text-3xl font-bold text-purple-600">
              {students.reduce((sum, s) => sum + s.completedCourses, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Avg Progress</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {Math.round(students.reduce((sum, s) => sum + s.totalProgress, 0) / students.length)}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
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
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={student.avatar} alt={student.name} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.courses.length} course{student.courses.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${student.totalProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{student.totalProgress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.courses.length > 0
                        ? new Date(student.courses[0].lastActivity).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.courses.some(c => c.status === 'active')
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.courses.some(c => c.status === 'active') ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewStudent(student.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleMessageStudent(student.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your course filter to see more students.</p>
          </div>
        )}
      </div>
    </div>
  )
}
