import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard');
        setStats(response.data.stats);
        setRecentActivity(response.data.recentActivity);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar role="admin" active="Dashboard" isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <Header role="admin" userName="Admin User" onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-50 to-indigo-50">

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-blue-100 text-lg">Monitor and manage your learning platform</p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers?.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">+{stats.monthlyGrowth}% this month</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Students</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalStudents?.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{stats.totalInstructors} instructors</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Courses</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">⭐ {stats.avgRating} avg rating</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Revenue</h3>
                <p className="text-3xl font-bold text-yellow-600">${stats.totalRevenue?.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{stats.activeSubscriptions} active subs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Overview */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Platform Overview</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Subscriptions</span>
                  <span className="font-semibold text-green-600">{stats.activeSubscriptions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Growth</span>
                  <span className="font-semibold text-blue-600">+{stats.monthlyGrowth}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold text-yellow-600">⭐ {stats.avgRating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Courses Published</span>
                  <span className="font-semibold text-purple-600">{stats.totalCourses}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="text-xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">👨‍🏫</div>
              <div className="font-semibold">Manage Instructors</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold">Review Courses</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">View Analytics</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-semibold">System Settings</div>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
