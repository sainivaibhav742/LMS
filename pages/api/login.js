// Mock API for login
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body

    // Mock authentication
    if (email === 'admin@example.com' && password === 'admin') {
      res.status(200).json({ token: 'admin-token', role: 'admin' })
    } else if (email === 'student@example.com' && password === 'student') {
      res.status(200).json({ token: 'student-token', role: 'student' })
    } else if (email === 'instructor@example.com' && password === 'instructor') {
      res.status(200).json({ token: 'instructor-token', role: 'instructor' })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
