import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'admin') {
      router.push('/login')
      return
    }

    const fetchPaymentsData = async () => {
      try {
        // Mock payments data - in real app, this would come from API
        const mockPayments = [
          {
            id: 1,
            transactionId: 'TXN_001234',
            student: 'John Doe',
            studentEmail: 'john.doe@example.com',
            course: 'Advanced React Development',
            instructor: 'Dr. Sarah Johnson',
            amount: 199.99,
            platformFee: 39.99,
            instructorShare: 160.00,
            status: 'completed',
            paymentMethod: 'Credit Card',
            date: '2023-05-15T10:30:00Z',
            refundable: true
          },
          {
            id: 2,
            transactionId: 'TXN_001235',
            student: 'Jane Smith',
            studentEmail: 'jane.smith@example.com',
            course: 'Python for Data Science',
            instructor: 'Dr. Michael Chen',
            amount: 249.99,
            platformFee: 49.99,
            instructorShare: 200.00,
            status: 'completed',
            paymentMethod: 'PayPal',
            date: '2023-05-14T14:20:00Z',
            refundable: true
          },
          {
            id: 3,
            transactionId: 'TXN_001236',
            student: 'Mike Johnson',
            studentEmail: 'mike.johnson@example.com',
            course: 'UI/UX Design Fundamentals',
            instructor: 'Dr. Sarah Johnson',
            amount: 149.99,
            platformFee: 29.99,
            instructorShare: 120.00,
            status: 'completed',
            paymentMethod: 'Credit Card',
            date: '2023-05-13T09:15:00Z',
            refundable: true
          },
          {
            id: 4,
            transactionId: 'TXN_001237',
            student: 'Sarah Wilson',
            studentEmail: 'sarah.wilson@example.com',
            course: 'Python for Data Science',
            instructor: 'Dr. Michael Chen',
            amount: 249.99,
            platformFee: 49.99,
            instructorShare: 200.00,
            status: 'refunded',
            paymentMethod: 'Credit Card',
            date: '2023-05-12T16:45:00Z',
            refundable: false
          },
          {
            id: 5,
            transactionId: 'TXN_001238',
            student: 'David Brown',
            studentEmail: 'david.brown@example.com',
            course: 'Cloud Computing with AWS',
            instructor: 'Prof. David Kim',
            amount: 349.99,
            platformFee: 69.99,
            instructorShare: 280.00,
            status: 'pending',
            paymentMethod: 'Bank Transfer',
            date: '2023-05-11T11:30:00Z',
            refundable: false
          }
        ]

        setPayments(mockPayments)
      } catch (err) {
        console.error('Failed to fetch payments data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentsData()
  }, [router])

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = activeTab === 'all' || payment.status === activeTab
    return matchesSearch && matchesStatus
  })

  const handleRefundPayment = (paymentId) => {
    if (confirm('Are you sure you want to process a refund for this payment?')) {
      setPayments(payments.map(payment =>
        payment.id === paymentId
          ? { ...payment, status: 'refunded', refundable: false }
          : payment
      ))
    }
  }

  const handleProcessPayment = (paymentId) => {
    setPayments(payments.map(payment =>
      payment.id === paymentId
        ? { ...payment, status: 'completed' }
        : payment
    ))
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      refunded: { color: 'bg-red-100 text-red-800', label: 'Refunded' },
      failed: { color: 'bg-gray-100 text-gray-800', label: 'Failed' }
    }
    const config = statusConfig[status] || statusConfig.failed
    return <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>{config.label}</span>
  }

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const totalPlatformFees = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.platformFee, 0)
  const totalInstructorPayouts = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.instructorShare, 0)

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="admin" active="Payments" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Management</h1>
              <p className="text-gray-600">Monitor transactions, process refunds, and manage payouts</p>
            </div>
            <button className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-semibold">
              Export Report
            </button>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">All completed payments</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Platform Fees</h3>
            <p className="text-3xl font-bold text-blue-600">${totalPlatformFees.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">20% of total revenue</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Instructor Payouts</h3>
            <p className="text-3xl font-bold text-purple-600">${totalInstructorPayouts.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">80% to instructors</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {payments.filter(p => p.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Awaiting processing</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search:</label>
              <input
                type="text"
                placeholder="Search by student, course, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All Payments', count: payments.length },
                  { id: 'completed', label: 'Completed', count: payments.filter(p => p.status === 'completed').length },
                  { id: 'pending', label: 'Pending', count: payments.filter(p => p.status === 'pending').length },
                  { id: 'refunded', label: 'Refunded', count: payments.filter(p => p.status === 'refunded').length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                        <div className="text-sm text-gray-500">{payment.paymentMethod}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.student}</div>
                        <div className="text-sm text-gray-500">{payment.studentEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.course}</div>
                        <div className="text-sm text-gray-500">by {payment.instructor}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">${payment.amount}</div>
                        <div className="text-xs text-gray-500">
                          Platform: ${payment.platformFee} | Instructor: ${payment.instructorShare}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => handleProcessPayment(payment.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Process
                        </button>
                      )}
                      {payment.status === 'completed' && payment.refundable && (
                        <button
                          onClick={() => handleRefundPayment(payment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">No payments found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
