import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function CoursePage() {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token) {
      router.push('/login')
      return
    }

    if (id) {
      const fetchCourse = async () => {
        try {
          const response = await axios.get(`/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setCourse(response.data)
        } catch (err) {
          console.error('Failed to fetch course', err)
        } finally {
          setLoading(false)
        }
      }

      fetchCourse()
    }
  }, [id, router])

  if (loading) return <div>Loading...</div>
  if (!course) return <div>Course not found</div>

  return (
    <div className="flex">
      <Sidebar role={localStorage.getItem('role')} active="Courses" />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">{course.title}</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <img src={course.thumbnail} alt={course.title} className="w-full h-64 object-cover rounded mb-4" />
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
          </div>
          <p className="text-gray-600">{course.progress}% Complete</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Lessons</h2>
          {course.lessons?.map((lesson, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium">{lesson.title}</h3>
              <p className="text-gray-600">{lesson.type}</p>
              <button className="mt-2 bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700">
                {lesson.completed ? 'Review' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
