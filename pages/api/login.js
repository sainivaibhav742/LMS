import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'pages', 'api', 'db.json');

function readDb() {
  const dbRaw = fs.readFileSync(dbPath);
  return JSON.parse(dbRaw);
}

export default function handler(req, res) {
  const db = readDb();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    const user = db.users.find(u => u.email === email && u.password === password);

    if (user) {
      res.status(200).json({ token: `${user.role}-token`, role: user.role });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
