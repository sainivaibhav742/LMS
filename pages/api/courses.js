import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'pages', 'api', 'db.json');

function readDb() {
  const dbRaw = fs.readFileSync(dbPath);
  return JSON.parse(dbRaw);
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  const db = readDb();

  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      const course = db.courses.find(c => c.id === parseInt(id));
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } else {
      res.status(200).json(db.courses);
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const initialLength = db.courses.length;
    db.courses = db.courses.filter(course => course.id !== parseInt(id));
    if (db.courses.length < initialLength) {
      writeDb(db);
      res.status(200).json({ message: `Course ${id} deleted` });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } else if (req.method === 'POST') {
    const newCourse = { id: db.courses.length + 1, ...req.body };
    db.courses.push(newCourse);
    writeDb(db);
    res.status(201).json(newCourse);
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    let updatedCourse = null;
    db.courses = db.courses.map(course => {
      if (course.id === parseInt(id)) {
        updatedCourse = { ...course, ...req.body };
        return updatedCourse;
      }
      return course;
    });
    if (updatedCourse) {
      writeDb(db);
      res.status(200).json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
