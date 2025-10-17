import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentCourses() {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
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
        setFilteredCourses(response.data)
      } catch (err) {
        console.error('Failed to fetch courses', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [router])

  useEffect(() => {
    let filtered = courses
    if (search) {
      filtered = filtered.filter(course => course.title.toLowerCase().includes(search.toLowerCase()))
    }
    if (category) {
      filtered = filtered.filter(course => course.category === category)
    }
    setFilteredCourses(filtered)
  }, [search, category, courses])

  const categories = [...new Set(courses.map(course => course.category))]

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="Courses" />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
              <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded mb-4" />
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-2">{course.category}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <p className="text-gray-600">{course.progress}% Complete</p>
              <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                Continue Learning
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
