import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentHelp() {
  const [activeTab, setActiveTab] = useState('faq')
  const [supportTickets, setSupportTickets] = useState([])
  const [newTicket, setNewTicket] = useState({ subject: '', message: '' })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
      router.push('/login')
      return
    }

    const fetchSupportData = async () => {
      try {
        // Mock support ticket data - in real app, this would come from API
        const mockTickets = [
          {
            id: 1,
            subject: 'Cannot access course materials',
            status: 'resolved',
            createdAt: '2023-05-10',
            lastUpdate: '2023-05-12',
            priority: 'medium'
          },
          {
            id: 2,
            subject: 'Certificate download issue',
            status: 'in_progress',
            createdAt: '2023-05-14',
            lastUpdate: '2023-05-15',
            priority: 'high'
          }
        ]
        setSupportTickets(mockTickets)
      } catch (err) {
        console.error('Failed to fetch support data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSupportData()
  }, [router])

  const handleSubmitTicket = (e) => {
    e.preventDefault()
    // In real app, this would submit to API
    alert('Support ticket submitted successfully!')
    setNewTicket({ subject: '', message: '' })
  }

  const faqData = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Go to the "My Courses" page and click "Enroll" on any available course.'
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page or go to Account Settings to change your password.'
    },
    {
      question: 'How do I download my certificate?',
      answer: 'Go to the "Certificates" page and click "Download PDF" next to any completed course.'
    },
    {
      question: 'How do I contact my instructor?',
      answer: 'Use the discussion forum within each course or submit a support ticket.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, PayPal, and bank transfers for course payments.'
    }
  ]

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="Help & Support" />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Help & Support</h1>

        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-2 px-4 rounded ${activeTab === 'faq' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`py-2 px-4 rounded ${activeTab === 'support' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Support Tickets
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-2 px-4 rounded ${activeTab === 'contact' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Contact Us
            </button>
          </nav>
        </div>

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'support' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Support Tickets</h2>
              <button
                onClick={() => setActiveTab('contact')}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                New Ticket
              </button>
            </div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{ticket.subject}</h3>
                      <p className="text-sm text-gray-600">Created: {ticket.createdAt} | Last Update: {ticket.lastUpdate}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.status === 'resolved' ? 'Resolved' :
                         ticket.status === 'in_progress' ? 'In Progress' : 'Open'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Priority: {ticket.priority}</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">Contact Support</h2>
            <form onSubmit={handleSubmitTicket} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
