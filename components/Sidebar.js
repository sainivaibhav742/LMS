import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Sidebar({ role, active }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.push('/login')
  }

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard' },
    { href: '/student/courses', label: 'My Courses' },
    { href: '/student/marketplace', label: 'Marketplace' },
    { href: '/student/progress', label: 'My Progress' },
    { href: '/student/quizzes', label: 'Quizzes' },
    { href: '/student/certificates', label: 'Certificates' },
    { href: '/student/payments', label: 'Payments' },
    { href: '/student/bookmarks', label: 'Bookmarks' },
    { href: '/student/discussions', label: 'Discussions' },
    { href: '/student/announcements', label: 'Announcements' },
    { href: '/student/notifications', label: 'Notifications' },
    { href: '/student/help', label: 'Help & Support' },
    { href: '/student/account', label: 'Account Settings' },
  ]

  const instructorLinks = [
    { href: '/instructor/dashboard', label: 'Dashboard' },
    { href: '/instructor/courses', label: 'My Courses' },
    { href: '/instructor/students', label: 'Students' },
    { href: '/instructor/analytics', label: 'Analytics' },
    { href: '/instructor/account', label: 'Account' },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/courses', label: 'Manage Courses' },
    { href: '/admin/marketplace', label: 'Marketplace' },
    { href: '/admin/students', label: 'Manage Students' },
    { href: '/admin/payments', label: 'Payments' },
    { href: '/admin/account', label: 'Account' },
  ]

  const links = role === 'admin' ? adminLinks : role === 'instructor' ? instructorLinks : studentLinks

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">
          LMS {role === 'admin' ? 'Admin' : role === 'instructor' ? 'Instructor' : 'Student'}
        </h2>
      </div>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.href} className="mb-2">
              <Link href={link.href} legacyBehavior>
                <a className={`block py-2 px-4 rounded ${active === link.label ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                  {link.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
