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
    if (req.query.type === 'instructor') {
      res.status(200).json({ instructors: db.instructors });
    } else {
      res.status(200).json({
        courses: db.courses,
        subscriptions: db.subscriptions,
      });
    }
  } else if (req.method === 'POST') {
    if (req.query.type === 'course') {
      const newCourse = { id: db.courses.length + 1, ...req.body };
      db.courses.push(newCourse);
      writeDb(db);
      res.status(201).json(newCourse);
    } else if (req.query.type === 'subscription') {
      const newSubscription = { id: db.subscriptions.length + 1, ...req.body };
      db.subscriptions.push(newSubscription);
      writeDb(db);
      res.status(201).json(newSubscription);
    } else {
      res.status(400).json({ message: 'Invalid type for POST request' });
    }
  } else if (req.method === 'PUT') {
    if (req.query.type === 'course') {
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
    } else if (req.query.type === 'subscription') {
      const { id } = req.query;
      let updatedSubscription = null;
      db.subscriptions = db.subscriptions.map(subscription => {
        if (subscription.id === parseInt(id)) {
          updatedSubscription = { ...subscription, ...req.body };
          return updatedSubscription;
        }
        return subscription;
      });
      if (updatedSubscription) {
        writeDb(db);
        res.status(200).json(updatedSubscription);
      } else {
        res.status(404).json({ message: 'Subscription not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid type for PUT request' });
    }
  } else if (req.method === 'DELETE') {
    if (req.query.type === 'course') {
      const { id } = req.query;
      const initialLength = db.courses.length;
      db.courses = db.courses.filter(course => course.id !== parseInt(id));
      if (db.courses.length < initialLength) {
        writeDb(db);
        res.status(200).json({ message: `Course ${id} deleted` });
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } else if (req.query.type === 'subscription') {
      const { id } = req.query;
      const initialLength = db.subscriptions.length;
      db.subscriptions = db.subscriptions.filter(subscription => subscription.id !== parseInt(id));
      if (db.subscriptions.length < initialLength) {
        writeDb(db);
        res.status(200).json({ message: `Subscription ${id} deleted` });
      } else {
        res.status(404).json({ message: 'Subscription not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid type for DELETE request' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
