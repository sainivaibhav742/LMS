import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Sidebar({ role, active, isCollapsed }) {
  const router = useRouter()
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const studentSections = [
    {
      title: 'My Learning',
      icon: '📚',
      items: [
        { href: '/student/courses', label: 'Enrolled Courses', icon: '🎓' },
        { href: '/student/progress', label: 'Learning Progress', icon: '📈' },
        { href: '/student/quizzes', label: 'Assessments', icon: '✍️' },
        { href: '/student/certificates', label: 'Achievements', icon: '🏆' },
      ]
    },
    {
      title: 'Discover',
      icon: '🔍',
      items: [
        { href: '/student/marketplace', label: 'Course Catalog', icon: '🛍️' },
      ]
    },
    {
      title: 'Community',
      icon: '👥',
      items: [
        { href: '/student/discussions', label: 'Discussions', icon: '💬' },
        { href: '/student/announcements', label: 'Announcements', icon: '📢' },
      ]
    },
    {
      title: 'Settings',
      icon: '⚙️',
      items: [
        { href: '/student/payments', label: 'Billing & Payments', icon: '💳' },
        { href: '/student/bookmarks', label: 'Saved Items', icon: '🔖' },
        { href: '/student/notifications', label: 'Notifications', icon: '🔔' },
        { href: '/student/help', label: 'Support Center', icon: '🆘' },
        { href: '/student/account', label: 'Profile Settings', icon: '👤' },
      ]
    }
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
    { href: '/admin/students', label: 'Manage Students' },
    { href: '/admin/marketplace', label: 'Marketplace' },
    { href: '/admin/payments', label: 'Payments' },
    { href: '/admin/account', label: 'Account' },
  ]

  return (
    <div className={`bg-white text-gray-800 min-h-screen flex flex-col shadow-lg border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-0 overflow-hidden' : 'w-64'}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">LearnHub</h2>
            <p className="text-xs text-gray-500 capitalize">
              {role === 'admin' ? 'Admin' : role === 'instructor' ? 'Instructor' : 'Student'}
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4">
        {role === 'student' ? (
          // Student sidebar with separate dashboard link and dropdown sections
          <>
            <div className="mb-6">
              <Link href="/student/dashboard" legacyBehavior>
                <a className={`flex items-center space-x-3 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === 'Dashboard'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                } ${isCollapsed ? 'justify-center' : ''}`}>
                  <span className="text-lg">🏠</span>
                  {!isCollapsed && <span>Dashboard</span>}
                </a>
              </Link>
            </div>
            {!isCollapsed && studentSections.map((section) => (
              <div key={section.title} className="mb-4">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-100 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium text-gray-700">{section.title}</span>
                  </div>
                  <span className={`transform transition-transform duration-200 text-gray-500 opacity-0 group-hover:opacity-100 ${openSections[section.title] ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>
                {openSections[section.title] && (
                  <ul className="ml-6 mt-2 space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} legacyBehavior>
                          <a className={`flex items-center space-x-3 py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                            active === item.label
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                          }`}>
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        ) : (
          // Admin and Instructor sidebar with simple links
          <ul className="space-y-2">
            {(role === 'admin' ? adminLinks : instructorLinks).map((link) => (
              <li key={link.href}>
                <Link href={link.href} legacyBehavior>
                  <a className={`flex items-center space-x-3 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active === link.label
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                  } ${isCollapsed ? 'justify-center px-3' : ''}`}>
                    <span className="text-lg">
                      {link.label === 'Dashboard' ? '🏠' :
                       link.label === 'My Courses' || link.label === 'Manage Courses' ? '📚' :
                       link.label === 'Students' || link.label === 'Manage Students' ? '👥' :
                       link.label === 'Analytics' ? '📊' :
                       link.label === 'Marketplace' ? '🛍️' :
                       link.label === 'Payments' ? '💳' :
                       '👤'}
                    </span>
                    {!isCollapsed && <span>{link.label}</span>}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

    </div>
  )
}
