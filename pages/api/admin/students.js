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
    res.status(200).json(db.users.filter(user => user.role === 'student'));
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    let updatedStudent = null;
    db.users = db.users.map(user => {
      if (user.id === parseInt(id) && user.role === 'student') {
        updatedStudent = { ...user, ...req.body };
        return updatedStudent;
      }
      return user;
    });
    if (updatedStudent) {
      writeDb(db);
      res.status(200).json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const initialLength = db.users.length;
    db.users = db.users.filter(user => !(user.id === parseInt(id) && user.role === 'student'));
    if (db.users.length < initialLength) {
      writeDb(db);
      res.status(200).json({ message: `Student ${id} deleted` });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
