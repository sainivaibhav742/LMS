import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentBookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchBookmarks = async () => {
      try {
        // Mock bookmark data - in real app, this would come from API
        const mockBookmarks = [
          {
            id: 1,
            courseTitle: 'Introduction to React',
            lessonTitle: 'Understanding Components',
            lessonNumber: 3,
            type: 'video',
            timestamp: '2023-05-15T10:30:00Z',
            notes: 'Important concept about props and state'
          },
          {
            id: 2,
            courseTitle: 'Advanced JavaScript',
            lessonTitle: 'Async/Await Patterns',
            lessonNumber: 7,
            type: 'reading',
            timestamp: '2023-05-14T14:20:00Z',
            notes: 'Need to review error handling patterns'
          },
          {
            id: 3,
            courseTitle: 'Data Structures and Algorithms',
            lessonTitle: 'Binary Search Trees',
            lessonNumber: 12,
            type: 'video',
            timestamp: '2023-05-13T09:15:00Z',
            notes: 'Complex topic, bookmark for later review'
          }
        ]
        setBookmarks(mockBookmarks)
      } catch (err) {
        console.error('Failed to fetch bookmarks', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [router])

  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return '🎥'
      case 'reading': return '📖'
      case 'quiz': return '📝'
      default: return '📌'
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="Bookmarks" />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">My Bookmarks</h1>

        {bookmarks.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No Bookmarks Yet</h3>
            <p className="text-gray-600">Bookmark lessons and materials to revisit them later!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{getTypeIcon(bookmark.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{bookmark.lessonTitle}</h3>
                      <p className="text-gray-600 mb-2">{bookmark.courseTitle} • Lesson {bookmark.lessonNumber}</p>
                      {bookmark.notes && (
                        <p className="text-sm text-gray-500 italic mb-2">"{bookmark.notes}"</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Bookmarked on {new Date(bookmark.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                      Continue Learning
                    </button>
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Bookmark Tips</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Bookmark important lessons for quick access later</li>
            <li>Add personal notes to remember key concepts</li>
            <li>Use bookmarks to track topics you want to review</li>
            <li>Organize your learning path with bookmarked materials</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
