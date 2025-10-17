import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchQuizzes = async () => {
      try {
        // Mock quiz data - in real app, this would come from API
        const mockQuizzes = [
          {
            id: 1,
            courseTitle: 'Introduction to React',
            title: 'React Fundamentals Quiz',
            questions: 10,
            timeLimit: 15,
            attempts: 2,
            bestScore: 85,
            status: 'completed'
          },
          {
            id: 2,
            courseTitle: 'Advanced JavaScript',
            title: 'ES6+ Features Quiz',
            questions: 15,
            timeLimit: 20,
            attempts: 1,
            bestScore: null,
            status: 'available'
          },
          {
            id: 3,
            courseTitle: 'Data Structures and Algorithms',
            title: 'Sorting Algorithms Quiz',
            questions: 12,
            timeLimit: 18,
            attempts: 0,
            bestScore: null,
            status: 'locked'
          }
        ]
        setQuizzes(mockQuizzes)
      } catch (err) {
        console.error('Failed to fetch quizzes', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="Quizzes" />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Quizzes & Assessments</h1>
        <div className="space-y-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{quiz.title}</h3>
                  <p className="text-gray-600">{quiz.courseTitle}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  quiz.status === 'completed' ? 'bg-green-100 text-green-800' :
                  quiz.status === 'available' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {quiz.status === 'completed' ? 'Completed' :
                   quiz.status === 'available' ? 'Available' : 'Locked'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Questions</p>
                  <p className="font-semibold">{quiz.questions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Limit</p>
                  <p className="font-semibold">{quiz.timeLimit} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Attempts</p>
                  <p className="font-semibold">{quiz.attempts}</p>
                </div>
                {quiz.bestScore && (
                  <div>
                    <p className="text-sm text-gray-500">Best Score</p>
                    <p className="font-semibold">{quiz.bestScore}%</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                {quiz.status === 'available' && (
                  <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                    Start Quiz
                  </button>
                )}
                {quiz.status === 'completed' && (
                  <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Review Answers
                  </button>
                )}
                {quiz.status === 'locked' && (
                  <button className="bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed" disabled>
                    Complete Course First
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
