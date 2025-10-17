import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentAccount() {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchUser = async () => {
      try {
        // Mock user data - in real app, this would come from API
        const mockUser = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          bio: 'Passionate learner interested in web development and technology.',
          profilePicture: 'https://via.placeholder.com/150?text=JD',
          joinDate: '2023-01-15',
          lastLogin: '2023-05-15',
          preferences: {
            emailNotifications: true,
            pushNotifications: false,
            darkMode: false
          }
        }
        setUser(mockUser)
      } catch (err) {
        console.error('Failed to fetch user', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="Account Settings" />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-4 rounded ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-4 rounded ${activeTab === 'security' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-2 px-4 rounded ${activeTab === 'preferences' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Preferences
            </button>
          </nav>
        </div>

        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <img src={user.profilePicture} alt="Profile" className="w-20 h-20 rounded-full mr-6" />
              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={user.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
                <textarea
                  defaultValue={user.bio}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                  Update Password
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-600 mb-4">Add an extra layer of security to your account.</p>
                <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                  Enable 2FA
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Login History</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Last login: {new Date(user.lastLogin).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Device: Chrome on Windows</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Notification Preferences</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={user.preferences?.emailNotifications}
                    className="sr-only"
                  />
                  <div className="relative">
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={user.preferences?.pushNotifications}
                    className="sr-only"
                  />
                  <div className="relative">
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Dark Mode</h3>
                  <p className="text-sm text-gray-600">Enable dark theme</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={user.preferences?.darkMode}
                    className="sr-only"
                  />
                  <div className="relative">
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
