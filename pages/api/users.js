// Mock API for users
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Mock users data
    const users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'student@example.com',
        role: 'student',
        enrolledCourses: 3,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'student2@example.com',
        role: 'student',
        enrolledCourses: 2,
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        enrolledCourses: 0,
      },
    ]
    res.status(200).json(users)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
