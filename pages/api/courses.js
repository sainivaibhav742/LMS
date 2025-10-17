// Mock API for courses
export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query
    if (id) {
      // Return single course
      const course = {
        id: parseInt(id),
        title: 'Introduction to React',
        progress: 75,
        thumbnail: 'https://via.placeholder.com/300x200?text=React',
        category: 'Web Development',
        description: 'Learn the basics of React, a popular JavaScript library for building user interfaces.',
        lessons: [
          { title: 'What is React?', type: 'Video', completed: true },
          { title: 'Setting up your environment', type: 'Video', completed: true },
          { title: 'Your first component', type: 'Video', completed: false },
          { title: 'Props and State', type: 'Video', completed: false },
          { title: 'React Quiz', type: 'Quiz', completed: false },
        ],
      }
      res.status(200).json(course)
    } else {
      // Mock courses data
      const courses = [
        {
          id: 1,
          title: 'Introduction to React',
          progress: 75,
          thumbnail: 'https://via.placeholder.com/300x200?text=React',
          category: 'Web Development',
        },
        {
          id: 2,
          title: 'Advanced JavaScript',
          progress: 50,
          thumbnail: 'https://via.placeholder.com/300x200?text=JS',
          category: 'Programming',
        },
        {
          id: 3,
          title: 'Data Structures and Algorithms',
          progress: 30,
          thumbnail: 'https://via.placeholder.com/300x200?text=DSA',
          category: 'Computer Science',
        },
      ]
      res.status(200).json(courses)
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query
    // Mock delete - in real app, this would delete from database
    res.status(200).json({ message: `Course ${id} deleted` })
  } else {
    res.setHeader('Allow', ['GET', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
