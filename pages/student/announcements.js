import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchAnnouncements = async () => {
      try {
        // Mock announcement data - in real app, this would come from API
        const mockAnnouncements = [
          {
            id: 1,
            title: 'New Course Available: Machine Learning Basics',
            content: 'We\'re excited to announce our new Machine Learning Basics course! This comprehensive course covers fundamental concepts including supervised and unsupervised learning, neural networks, and practical applications. Enrollment opens next Monday.',
            type: 'course_update',
            priority: 'high',
            timestamp: '2023-05-15T09:00:00Z',
            author: 'Course Team',
            read: false
          },
          {
            id: 2,
            title: 'Platform Maintenance: Sunday 2-4 AM EST',
            content: 'Scheduled maintenance will occur this Sunday from 2:00 AM to 4:00 AM EST. During this time, the platform will be temporarily unavailable. We apologize for any inconvenience and appreciate your understanding.',
            type: 'maintenance',
            priority: 'medium',
            timestamp: '2023-05-14T14:30:00Z',
            author: 'Technical Team',
            read: true
          },
          {
            id: 3,
            title: 'Congratulations to Our Top Performers!',
            content: 'A big congratulations to all students who achieved perfect scores on last month\'s quizzes! Your dedication and hard work are truly inspiring. Keep up the excellent work!',
            type: 'achievement',
            priority: 'low',
            timestamp: '2023-05-13T11:15:00Z',
            author: 'Academic Team',
            read: true
          },
          {
            id: 4,
            title: 'Updated Learning Resources Available',
            content: 'We\'ve added new supplementary materials to several courses including additional practice exercises, video tutorials, and interactive coding challenges. Check your course materials for the latest updates.',
            type: 'resource_update',
            priority: 'medium',
            timestamp: '2023-05-12T16:45:00Z',
            author: 'Content Team',
            read: false
          },
          {
            id: 5,
            title: 'Community Webinar: Career in Tech',
            content: 'Join us for a free webinar on "Building a Successful Career in Technology" featuring industry experts. Topics include resume building, interview tips, and career progression strategies. Register now!',
            type: 'event',
            priority: 'high',
            timestamp: '2023-05-11T10:20:00Z',
            author: 'Community Team',
            read: true
          }
        ]
        setAnnouncements(mockAnnouncements)
      } catch (err) {
        console.error('Failed to fetch announcements', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [router])

  const markAsRead = (id) => {
    setAnnouncements(announcements.map(announcement =>
      announcement.id === id ? { ...announcement, read: true } : announcement
    ))
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course_update': return '📚'
      case 'maintenance': return '🔧'
      case 'achievement': return '🏆'
      case 'resource_update': return '📖'
      case 'event': return '📅'
      default: return '📢'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-blue-500 bg-blue-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  if (loading) return <div>Loading...</div>

  const unreadCount = announcements.filter(a => !a.read).length

  return (
    <div className="flex">
      <Sidebar role="student" active="Announcements" />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Announcements & News</h1>
          {unreadCount > 0 && (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {unreadCount} unread
            </div>
          )}
        </div>

        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`border-l-4 p-6 rounded-lg shadow-md ${getPriorityColor(announcement.priority)} ${
                !announcement.read ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getTypeIcon(announcement.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{announcement.title}</h3>
                      {!announcement.read && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{announcement.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {announcement.author}</span>
                      <span>{new Date(announcement.timestamp).toLocaleString()}</span>
                      <span className="capitalize">{announcement.priority} priority</span>
                    </div>
                  </div>
                </div>
                {!announcement.read && (
                  <button
                    onClick={() => markAsRead(announcement.id)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-semibold mb-2">No Announcements</h3>
            <p className="text-gray-600">Check back later for updates and news!</p>
          </div>
        )}

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">📧 Email Notifications</h3>
              <p className="text-sm text-gray-600 mb-2">Get important announcements delivered to your inbox</p>
              <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                Manage Email Preferences
              </button>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔔 Push Notifications</h3>
              <p className="text-sm text-gray-600 mb-2">Receive instant notifications in your browser</p>
              <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                Enable Push Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
