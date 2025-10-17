import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchPayments = async () => {
      try {
        // Mock payment data - in real app, this would come from API
        const mockPayments = [
          {
            id: 1,
            courseTitle: 'Introduction to React',
            amount: 99.99,
            date: '2023-05-01',
            status: 'completed',
            paymentMethod: 'Credit Card',
            invoiceId: 'INV-001'
          },
          {
            id: 2,
            courseTitle: 'Advanced JavaScript',
            amount: 79.99,
            date: '2023-04-15',
            status: 'completed',
            paymentMethod: 'PayPal',
            invoiceId: 'INV-002'
          },
          {
            id: 3,
            courseTitle: 'Data Structures and Algorithms',
            amount: 149.99,
            date: '2023-06-01',
            status: 'pending',
            paymentMethod: 'Credit Card',
            invoiceId: 'INV-003'
          }
        ]
        setPayments(mockPayments)
      } catch (err) {
        console.error('Failed to fetch payments', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="Payments" />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Payment History</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.courseTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status === 'completed' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Download Invoice</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Payment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
              <p className="text-3xl font-bold text-green-600">
                ${payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Courses Purchased</h3>
              <p className="text-3xl font-bold text-blue-600">
                {payments.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {payments.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
