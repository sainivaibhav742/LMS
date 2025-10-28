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
    const adminUser = db.users.find(user => user.role === 'admin');
    if (adminUser) {
      res.status(200).json(adminUser);
    } else {
      res.status(404).json({ message: 'Admin user not found' });
    }
  } else if (req.method === 'PUT') {
    let updatedAdmin = null;
    db.users = db.users.map(user => {
      if (user.role === 'admin') {
        updatedAdmin = { ...user, ...req.body };
        return updatedAdmin;
      }
      return user;
    });
    if (updatedAdmin) {
      writeDb(db);
      res.status(200).json(updatedAdmin);
    } else {
      res.status(404).json({ message: 'Admin user not found' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
