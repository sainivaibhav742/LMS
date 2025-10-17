import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchNotifications = async () => {
      try {
        // Mock notification data - in real app, this would come from API
        const mockNotifications = [
          {
            id: 1,
            type: 'course_update',
            title: 'New Course Available',
            message: 'Advanced JavaScript course is now available for enrollment!',
            timestamp: '2023-05-15T10:30:00Z',
            read: false,
            priority: 'high'
          },
          {
            id: 2,
            type: 'certificate',
            title: 'Certificate Earned',
            message: 'Congratulations! You have earned a certificate for completing "React Basics".',
            timestamp: '2023-05-14T14:20:00Z',
            read: true,
            priority: 'medium'
          },
          {
            id: 3,
            type: 'announcement',
            title: 'System Maintenance',
            message: 'Scheduled maintenance will occur on May 20th from 2-4 AM EST.',
            timestamp: '2023-05-13T09:15:00Z',
            read: true,
            priority: 'low'
          },
          {
            id: 4,
            type: 'deadline',
            title: 'Assignment Due Soon',
            message: 'Your assignment for "JavaScript Fundamentals" is due in 2 days.',
            timestamp: '2023-05-12T16:45:00Z',
            read: false,
            priority: 'high'
          },
          {
            id: 5,
            type: 'grade',
            title: 'Quiz Results Available',
            message: 'Your quiz results for "ES6+ Features" are now available.',
            timestamp: '2023-05-11T11:00:00Z',
            read: true,
            priority: 'medium'
          }
        ]
        setNotifications(mockNotifications)
      } catch (err) {
        console.error('Failed to fetch notifications', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [router])

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500'
      case 'medium': return 'border-yellow-500'
      case 'low': return 'border-blue-500'
      default: return 'border-gray-500'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course_update': return '📚'
      case 'certificate': return '🏆'
      case 'announcement': return '📢'
      case 'deadline': return '⏰'
      case 'grade': return '📊'
      default: return '📌'
    }
  }

  if (loading) return <div>Loading...</div>

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex">
      <Sidebar role="student" active="Notifications" />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Mark All as Read ({unreadCount})
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${getPriorityColor(notification.priority)} ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{notification.title}</h3>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}
