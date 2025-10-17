import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function AdminAccount() {
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'admin') {
      router.push('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        // Mock admin profile data - in real app, this would come from API
        const mockProfile = {
          id: 1,
          name: 'Alex Thompson',
          email: 'admin@lms-platform.com',
          bio: 'Platform administrator with 8+ years of experience in educational technology and system management. Passionate about creating scalable learning solutions.',
          avatar: 'https://via.placeholder.com/150x150?text=AT',
          role: 'Platform Administrator',
          department: 'Technology & Operations',
          joinDate: '2020-03-15',
          lastLogin: '2023-05-15T09:30:00Z',
          permissions: [
            'User Management',
            'Course Oversight',
            'Financial Administration',
            'System Configuration',
            'Analytics & Reporting',
            'Content Moderation'
          ],
          contactInfo: {
            phone: '+1 (555) 123-4567',
            emergency: '+1 (555) 987-6543',
            address: '123 Tech Street, Silicon Valley, CA 94025'
          },
          systemStats: {
            totalLogins: 1247,
            actionsPerformed: 3456,
            reportsGenerated: 89,
            uptime: '99.9%'
          },
          securitySettings: {
            twoFactorEnabled: true,
            lastPasswordChange: '2023-04-01',
            loginAlerts: true,
            sessionTimeout: '8 hours'
          }
        }

        setProfile(mockProfile)
        setFormData(mockProfile)
      } catch (err) {
        console.error('Failed to fetch profile', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      // In real app, this would make an API call to update profile
      setProfile(formData)
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (err) {
      console.error('Failed to update profile', err)
      alert('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setEditing(false)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="admin" active="Account" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Account Settings</h1>
          <p className="text-gray-600">Manage your administrator profile and system preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-gray-600">{profile.role}</p>
                <p className="text-sm text-gray-500">{profile.department}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-semibold">{new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Login:</span>
                    <span className="font-semibold">{new Date(profile.lastLogin).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">System Uptime:</span>
                    <span className="font-semibold text-green-600">{profile.systemStats?.uptime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Logins</span>
                  <span className="font-semibold">{profile.systemStats?.totalLogins.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actions Performed</span>
                  <span className="font-semibold">{profile.systemStats?.actionsPerformed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reports Generated</span>
                  <span className="font-semibold">{profile.systemStats?.reportsGenerated}</span>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 className="text-lg font-semibold mb-4">Admin Permissions</h3>
              <div className="space-y-2">
                {profile.permissions?.map((permission, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.email}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.bio}</p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.contactInfo?.phone || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, phone: e.target.value }
                        }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.contactInfo?.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                    {editing ? (
                      <input
                        type="tel"
                        name="emergency"
                        value={formData.contactInfo?.emergency || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, emergency: e.target.value }
                        }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.contactInfo?.emergency}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.contactInfo?.address || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, address: e.target.value }
                      }))}
                      rows={2}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.contactInfo?.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-md mt-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Security Settings</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Two-Factor Authentication</label>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${profile.securitySettings?.twoFactorEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-600">
                        {profile.securitySettings?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Password Change</label>
                    <p className="text-gray-900">{new Date(profile.securitySettings?.lastPasswordChange).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Login Alerts</label>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${profile.securitySettings?.loginAlerts ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-600">
                        {profile.securitySettings?.loginAlerts ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                    <p className="text-gray-900">{profile.securitySettings?.sessionTimeout}</p>
                  </div>
                </div>
                <div className="mt-6 space-x-4">
                  <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                    Change Password
                  </button>
                  <button className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700">
                    Security Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
