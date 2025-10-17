import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import axios from 'axios'

export default function StudentDiscussions() {
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchDiscussions = async () => {
      try {
        // Assuming there's an API endpoint for discussions
        const response = await axios.get('/api/discussions', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setDiscussions(response.data)
      } catch (err) {
        console.error('Failed to fetch discussions', err)
        // For demo purposes, set some mock data
        setDiscussions([
          {
            id: 1,
            title: 'Understanding React Hooks',
            course: 'Advanced React Development',
            author: 'Sarah Johnson',
            replies: 12,
            lastActivity: '2 hours ago',
            category: 'Technical Questions'
          },
          {
            id: 2,
            title: 'Best practices for CSS Grid',
            course: 'Modern CSS Techniques',
            author: 'Mike Chen',
            replies: 8,
            lastActivity: '1 day ago',
            category: 'Tips & Tricks'
          },
          {
            id: 3,
            title: 'Project collaboration ideas',
            course: 'Team Development',
            author: 'Alex Rodriguez',
            replies: 15,
            lastActivity: '3 days ago',
            category: 'General Discussion'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussions()
  }, [router])

  if (loading) {
    return (
      <div className="flex bg-neutral-50 min-h-screen">
        <Sidebar role="student" active="Discussions" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading discussions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-neutral-50 min-h-screen">
      <Sidebar role="student" active="Discussions" />
      <div className="flex-1 flex flex-col">
        <Header role="student" userName="John Doe" />
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="page-header">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="page-title">Discussions 💬</h1>
                <p className="page-subtitle">Connect with fellow learners and instructors</p>
              </div>
              <button className="btn-primary">
                Start New Discussion
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="stat-card card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-700 mb-1">Total Discussions</h3>
                  <p className="text-3xl font-bold text-primary-600">{discussions.length}</p>
                  <p className="text-sm text-neutral-500 mt-1">Active conversations</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
              </div>
            </div>

            <div className="stat-card card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-700 mb-1">Your Posts</h3>
                  <p className="text-3xl font-bold text-secondary-600">5</p>
                  <p className="text-sm text-neutral-500 mt-1">Contributions made</p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✍️</span>
                </div>
              </div>
            </div>

            <div className="stat-card card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-700 mb-1">Replies Received</h3>
                  <p className="text-3xl font-bold text-accent-600">23</p>
                  <p className="text-sm text-neutral-500 mt-1">Community engagement</p>
                </div>
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">❤️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Discussions List */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Recent Discussions</h2>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>All Categories</option>
                  <option>Technical Questions</option>
                  <option>Tips & Tricks</option>
                  <option>General Discussion</option>
                </select>
                <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Most Recent</option>
                  <option>Most Replies</option>
                  <option>Unanswered</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          discussion.category === 'Technical Questions' ? 'bg-primary-100 text-primary-700' :
                          discussion.category === 'Tips & Tricks' ? 'bg-secondary-100 text-secondary-700' :
                          'bg-accent-100 text-accent-700'
                        }`}>
                          {discussion.category}
                        </span>
                        <span className="text-sm text-neutral-500">in {discussion.course}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2 hover:text-primary-600 transition-colors">
                        {discussion.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <span>By {discussion.author}</span>
                        <span>{discussion.replies} replies</span>
                        <span>Last activity {discussion.lastActivity}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
                        <span className="text-lg">👍</span>
                      </button>
                      <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
                        <span className="text-lg">📌</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {discussions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No discussions yet</h3>
                <p className="text-neutral-600 mb-4">Be the first to start a conversation!</p>
                <button className="btn-primary">
                  Start New Discussion
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Discussion Guidelines</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-start space-x-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>Be respectful and constructive in your comments</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>Use clear and descriptive titles for new discussions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>Search existing discussions before posting</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>Share knowledge and help others learn</span>
                </li>
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Popular Topics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-900">React Best Practices</span>
                  <span className="text-xs text-neutral-500">18 discussions</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-900">JavaScript Fundamentals</span>
                  <span className="text-xs text-neutral-500">15 discussions</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-900">CSS Layout Techniques</span>
                  <span className="text-xs text-neutral-500">12 discussions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
