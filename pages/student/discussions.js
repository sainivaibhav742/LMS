import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentDiscussions() {
  const [discussions, setDiscussions] = useState([])
  const [activeDiscussion, setActiveDiscussion] = useState(null)
  const [newPost, setNewPost] = useState('')
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
        // Mock discussion data - in real app, this would come from API
        const mockDiscussions = [
          {
            id: 1,
            courseTitle: 'Introduction to React',
            title: 'Help with useEffect hook',
            author: 'John Doe',
            timestamp: '2023-05-15T10:30:00Z',
            replies: 5,
            lastReply: '2023-05-15T14:20:00Z',
            content: 'I\'m having trouble understanding when useEffect runs. Can someone explain the dependency array?',
            replies: [
              {
                id: 1,
                author: 'Jane Smith',
                content: 'The dependency array tells React when to re-run the effect. If it\'s empty [], it runs once after mount.',
                timestamp: '2023-05-15T11:00:00Z'
              },
              {
                id: 2,
                author: 'Mike Johnson',
                content: 'You can also pass specific values to watch for changes.',
                timestamp: '2023-05-15T12:30:00Z'
              }
            ]
          },
          {
            id: 2,
            courseTitle: 'Advanced JavaScript',
            title: 'Promises vs Async/Await',
            author: 'Sarah Wilson',
            timestamp: '2023-05-14T09:15:00Z',
            replies: 3,
            lastReply: '2023-05-14T16:45:00Z',
            content: 'When should I use promises vs async/await? Are there performance differences?',
            replies: [
              {
                id: 3,
                author: 'Tom Brown',
                content: 'Async/await is syntactic sugar over promises. Use whatever is more readable for your use case.',
                timestamp: '2023-05-14T10:20:00Z'
              }
            ]
          }
        ]
        setDiscussions(mockDiscussions)
      } catch (err) {
        console.error('Failed to fetch discussions', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussions()
  }, [router])

  const handleNewPost = (e) => {
    e.preventDefault()
    if (!newPost.trim()) return

    // In real app, this would submit to API
    const newDiscussion = {
      id: discussions.length + 1,
      courseTitle: 'General',
      title: 'New Question',
      author: 'John Doe',
      timestamp: new Date().toISOString(),
      replies: 0,
      lastReply: new Date().toISOString(),
      content: newPost,
      replies: []
    }

    setDiscussions([newDiscussion, ...discussions])
    setNewPost('')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="Discussions" />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Course Discussions</h1>
          <button
            onClick={() => setActiveDiscussion(null)}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            New Discussion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discussion List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Discussions</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {discussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    onClick={() => setActiveDiscussion(discussion)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      activeDiscussion?.id === discussion.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <h3 className="font-semibold text-sm mb-1">{discussion.title}</h3>
                    <p className="text-xs text-gray-600 mb-1">{discussion.courseTitle}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{discussion.author}</span>
                      <span>{discussion.replies.length} replies</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Discussion Detail / New Post */}
          <div className="lg:col-span-2">
            {activeDiscussion ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold mb-2">{activeDiscussion.title}</h2>
                  <p className="text-gray-600 mb-2">{activeDiscussion.courseTitle}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Posted by {activeDiscussion.author}</span>
                    <span>{new Date(activeDiscussion.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-800">{activeDiscussion.content}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Replies ({activeDiscussion.replies.length})</h3>
                  {activeDiscussion.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 p-4 rounded">
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>{reply.author}</span>
                        <span>{new Date(reply.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-800">{reply.content}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <textarea
                    placeholder="Write a reply..."
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                  />
                  <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                    Post Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Start a New Discussion</h2>
                <form onSubmit={handleNewPost}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Topic</label>
                    <input
                      type="text"
                      placeholder="What's your question or topic?"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Course (Optional)</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">General Discussion</option>
                      <option value="react">Introduction to React</option>
                      <option value="js">Advanced JavaScript</option>
                      <option value="dsa">Data Structures and Algorithms</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Describe your question or share your thoughts..."
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                  >
                    Post Discussion
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
