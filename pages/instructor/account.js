import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function InstructorAccount() {
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'instructor') {
      router.push('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        // Mock profile data - in real app, this would come from API
        const mockProfile = {
          id: 1,
          name: 'Dr. Sarah Johnson',
          email: 'instructor@example.com',
          bio: 'Experienced educator with 10+ years in web development and data science. Passionate about teaching and helping students achieve their goals.',
          avatar: 'https://via.placeholder.com/150x150?text=SJ',
          expertise: ['React', 'JavaScript', 'Python', 'Data Science', 'UI/UX Design'],
          socialLinks: {
            linkedin: 'https://linkedin.com/in/sarahjohnson',
            twitter: 'https://twitter.com/sarahdev',
            website: 'https://sarahjohnson.dev'
          },
          stats: {
            totalCourses: 8,
            totalStudents: 1247,
            totalRevenue: 18950.00,
            avgRating: 4.7,
            joinDate: '2022-01-15'
          },
          bankDetails: {
            accountHolder: 'Dr. Sarah Johnson',
            bankName: 'Example Bank',
            accountNumber: '****1234',
            routingNumber: '****5678'
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
      <Sidebar role="instructor" active="Account" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile and account information</p>
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
                <p className="text-gray-600">{profile.email}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Courses:</span>
                    <span className="font-semibold">{profile.stats?.totalCourses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-semibold">{profile.stats?.totalStudents.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold">⭐ {profile.stats?.avgRating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold text-green-600">${profile.stats?.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">{new Date(profile.stats?.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expertise Areas</span>
                  <span className="font-semibold">{profile.expertise?.length}</span>
                </div>
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

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise</label>
                  {editing ? (
                    <input
                      type="text"
                      name="expertise"
                      value={formData.expertise?.join(', ') || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        expertise: e.target.value.split(', ')
                      }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Separate with commas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.expertise?.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    {editing ? (
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.socialLinks?.linkedin || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                        }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <a href={profile.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                    {editing ? (
                      <input
                        type="url"
                        name="twitter"
                        value={formData.socialLinks?.twitter || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                        }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <a href={profile.socialLinks?.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Twitter Profile
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    {editing ? (
                      <input
                        type="url"
                        name="website"
                        value={formData.socialLinks?.website || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, website: e.target.value }
                        }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <a href={profile.socialLinks?.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Personal Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-lg shadow-md mt-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Payment Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder</label>
                    <p className="text-gray-900">{profile.bankDetails?.accountHolder}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <p className="text-gray-900">{profile.bankDetails?.bankName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <p className="text-gray-900">{profile.bankDetails?.accountNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                    <p className="text-gray-900">{profile.bankDetails?.routingNumber}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                    Update Payment Info
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
