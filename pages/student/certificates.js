import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchCertificates = async () => {
      try {
        // Mock certificate data - in real app, this would come from API
        const mockCertificates = [
          {
            id: 1,
            courseTitle: 'Introduction to React',
            completionDate: '2023-05-15',
            certificateId: 'CERT-001-2023',
            instructor: 'Jane Smith',
            grade: 'A',
            thumbnail: 'https://via.placeholder.com/300x200?text=React+Certificate'
          },
          {
            id: 2,
            courseTitle: 'JavaScript Fundamentals',
            completionDate: '2023-04-20',
            certificateId: 'CERT-002-2023',
            instructor: 'John Doe',
            grade: 'A+',
            thumbnail: 'https://via.placeholder.com/300x200?text=JS+Certificate'
          }
        ]
        setCertificates(mockCertificates)
      } catch (err) {
        console.error('Failed to fetch certificates', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="Certificates" />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Certificates & Achievements</h1>

        {certificates.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
            <p className="text-gray-600">Complete your courses to earn certificates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img src={cert.thumbnail} alt={cert.courseTitle} className="w-16 h-16 object-cover rounded mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold">{cert.courseTitle}</h3>
                    <p className="text-gray-600">Certificate ID: {cert.certificateId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Completion Date</p>
                    <p className="font-semibold">{new Date(cert.completionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="font-semibold">{cert.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Instructor</p>
                    <p className="font-semibold">{cert.instructor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold text-green-600">Verified</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                    Download PDF
                  </button>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Share Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-semibold">First Course Completed</h3>
              <p className="text-sm text-gray-600">Earned on April 20, 2023</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-4xl mb-2">🔥</div>
              <h3 className="font-semibold">5-Day Streak</h3>
              <p className="text-sm text-gray-600">Consistent learning</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="font-semibold">Top Performer</h3>
              <p className="text-sm text-gray-600">Scored A+ in 2 courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
