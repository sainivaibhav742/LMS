import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function AdminMarketplace() {
  const [courses, setCourses] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('courses')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'admin') {
      router.push('/login')
      return
    }

    const fetchMarketplaceData = async () => {
      try {
        // Mock marketplace data - in real app, this would come from API
        const mockCourses = [
          {
            id: 1,
            title: 'Advanced React Development',
            instructor: 'Sarah Johnson',
            category: 'Web Development',
            price: 99.99,
            originalPrice: 149.99,
            enrolled: 2340,
            rating: 4.8,
            status: 'active',
            lastUpdated: '2023-05-15'
          },
          {
            id: 2,
            title: 'Python for Data Science',
            instructor: 'Dr. Michael Chen',
            category: 'Data Science',
            price: 129.99,
            originalPrice: 199.99,
            enrolled: 1890,
            rating: 4.9,
            status: 'active',
            lastUpdated: '2023-05-14'
          }
        ]

        const mockSubscriptions = [
          {
            id: 1,
            name: 'Premium Learning Pass',
            price: 29.99,
            period: 'month',
            subscribers: 1250,
            revenue: 37497.50,
            status: 'active',
            created: '2023-01-15'
          },
          {
            id: 2,
            name: 'Annual Learning Pass',
            price: 299.99,
            period: 'year',
            subscribers: 450,
            revenue: 134995.50,
            status: 'active',
            created: '2023-02-01'
          }
        ]

        setCourses(mockCourses)
        setSubscriptions(mockSubscriptions)
      } catch (err) {
        console.error('Failed to fetch marketplace data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketplaceData()
  }, [router])

  const handleEditCourse = (courseId) => {
    // In real app, this would open edit modal or navigate to edit page
    alert(`Edit course ${courseId}`)
  }

  const handleDeleteCourse = (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId))
    }
  }

  const handleEditSubscription = (subscriptionId) => {
    // In real app, this would open edit modal or navigate to edit page
    alert(`Edit subscription ${subscriptionId}`)
  }

  const handleDeleteSubscription = (subscriptionId) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId))
    }
  }

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.revenue, 0)
  const totalSubscribers = subscriptions.reduce((sum, sub) => sum + sub.subscribers, 0)

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="admin" active="Marketplace" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Marketplace Management</h1>
          <p className="text-gray-600">Manage courses, pricing, and subscription plans</p>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">From subscriptions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Active Subscribers</h3>
            <p className="text-3xl font-bold text-blue-600">{totalSubscribers.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total subscribers</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Courses Sold</h3>
            <p className="text-3xl font-bold text-purple-600">
              {courses.reduce((sum, course) => sum + course.enrolled, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Individual enrollments</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'courses', label: 'Courses' },
                { id: 'subscriptions', label: 'Subscriptions' },
                { id: 'pricing', label: 'Pricing & Discounts' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Premium Courses</h2>
                <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                  Add New Course
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrolled
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">by {course.instructor}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">${course.price}</div>
                          <div className="text-gray-500 line-through">${course.originalPrice}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.enrolled.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ⭐ {course.rating}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditCourse(course.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Subscription Plans</h2>
                <button className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                  Add New Plan
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{sub.name}</div>
                          <div className="text-sm text-gray-500">per {sub.period}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${sub.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sub.subscribers.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${sub.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditSubscription(sub.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSubscription(sub.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pricing & Discounts Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Bulk Discounts</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">Student Discount</h3>
                    <p className="text-sm text-gray-500">20% off for verified students</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600 font-semibold">Active</span>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">Group Purchase</h3>
                    <p className="text-sm text-gray-500">15% off for 5+ courses</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600 font-semibold">Active</span>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                  </div>
                </div>
              </div>
              <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                Add New Discount
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Promotional Campaigns</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">Summer Sale</h3>
                    <p className="text-sm text-gray-500">30% off all courses - June 1-30</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-orange-600 font-semibold">Scheduled</span>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                  </div>
                </div>
              </div>
              <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                Create Campaign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
