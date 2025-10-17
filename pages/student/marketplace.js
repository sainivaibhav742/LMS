import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export default function StudentMarketplace() {
  const [courses, setCourses] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, free, paid, subscription

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'student') {
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
            rating: 4.8,
            reviews: 156,
            duration: '8 weeks',
            level: 'Advanced',
            price: 99.99,
            originalPrice: 149.99,
            enrolled: 2340,
            thumbnail: 'https://via.placeholder.com/300x200?text=React+Advanced',
            description: 'Master advanced React concepts including hooks, context, and performance optimization.',
            features: ['Lifetime access', 'Certificate of completion', 'Mobile access', 'Community support'],
            tags: ['React', 'JavaScript', 'Frontend', 'Hooks']
          },
          {
            id: 2,
            title: 'Python for Data Science',
            instructor: 'Dr. Michael Chen',
            category: 'Data Science',
            rating: 4.9,
            reviews: 203,
            duration: '12 weeks',
            level: 'Intermediate',
            price: 129.99,
            originalPrice: 199.99,
            enrolled: 1890,
            thumbnail: 'https://via.placeholder.com/300x200?text=Python+Data+Science',
            description: 'Learn Python programming for data analysis, visualization, and machine learning.',
            features: ['Hands-on projects', 'Dataset included', 'Career guidance', '24/7 support'],
            tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas']
          },
          {
            id: 3,
            title: 'UI/UX Design Fundamentals',
            instructor: 'Emma Rodriguez',
            category: 'Design',
            rating: 4.7,
            reviews: 98,
            duration: '6 weeks',
            level: 'Beginner',
            price: 79.99,
            originalPrice: 119.99,
            enrolled: 1456,
            thumbnail: 'https://via.placeholder.com/300x200?text=UI+UX+Design',
            description: 'Learn the principles of user interface and user experience design.',
            features: ['Design tools included', 'Portfolio projects', 'Industry insights', 'Mentorship'],
            tags: ['UI/UX', 'Design', 'Figma', 'Prototyping']
          },
          {
            id: 4,
            title: 'DevOps with Docker & Kubernetes',
            instructor: 'James Wilson',
            category: 'DevOps',
            rating: 4.6,
            reviews: 87,
            duration: '10 weeks',
            level: 'Advanced',
            price: 149.99,
            originalPrice: 229.99,
            enrolled: 987,
            thumbnail: 'https://via.placeholder.com/300x200?text=DevOps+Docker+K8s',
            description: 'Master containerization and orchestration with Docker and Kubernetes.',
            features: ['Cloud deployment', 'Real-world scenarios', 'Certification prep', 'Expert guidance'],
            tags: ['Docker', 'Kubernetes', 'DevOps', 'Cloud']
          },
          {
            id: 5,
            title: 'Mobile App Development with Flutter',
            instructor: 'Lisa Park',
            category: 'Mobile Development',
            rating: 4.8,
            reviews: 134,
            duration: '9 weeks',
            level: 'Intermediate',
            price: 109.99,
            originalPrice: 169.99,
            enrolled: 1678,
            thumbnail: 'https://via.placeholder.com/300x200?text=Flutter+Mobile',
            description: 'Build cross-platform mobile apps with Flutter and Dart.',
            features: ['iOS & Android', 'Firebase integration', 'App store deployment', 'Code templates'],
            tags: ['Flutter', 'Dart', 'Mobile', 'Cross-platform']
          }
        ]

        const mockSubscriptions = [
          {
            id: 1,
            name: 'Premium Learning Pass',
            price: 29.99,
            period: 'month',
            features: ['Access to all courses', 'Priority support', 'Downloadable resources', 'Offline access'],
            popular: true
          },
          {
            id: 2,
            name: 'Annual Learning Pass',
            price: 299.99,
            period: 'year',
            features: ['Access to all courses', 'Priority support', 'Downloadable resources', 'Offline access', '2 months free'],
            popular: false
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

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true
    if (filter === 'free') return course.price === 0
    if (filter === 'paid') return course.price > 0
    return true
  })



  if (loading) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar role="student" active="Marketplace" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Course Marketplace</h1>
          <p className="text-gray-600">Discover and purchase premium courses to accelerate your learning journey</p>
        </div>

        {/* Subscription Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Learning Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className={`bg-white p-6 rounded-lg shadow-md border-2 ${sub.popular ? 'border-indigo-500' : 'border-gray-200'}`}>
                {sub.popular && (
                  <div className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded mb-4 inline-block">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{sub.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${sub.price}</span>
                  <span className="text-gray-500">/{sub.period}</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {sub.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 px-4 rounded font-semibold ${
                    sub.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  Subscribe Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Course Filters */}
        <div className="mb-8">
          <div className="flex space-x-4">
            {['all', 'paid'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded capitalize ${
                  filter === filterOption
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filterOption === 'all' ? 'All Courses' : 'Premium Courses'}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {course.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">
                    {course.level}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3">by {course.instructor}</p>

                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-4">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-sm font-semibold">{course.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({course.reviews})</span>
                  </div>
                  <span className="text-gray-500 text-sm">{course.duration}</span>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-indigo-600">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{course.enrolled.toLocaleString()} enrolled</span>
                </div>

                <button
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 font-semibold"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more courses.</p>
          </div>
        )}


      </div>
    </div>
  )
}
