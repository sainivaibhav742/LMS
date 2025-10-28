import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'pages', 'api', 'db.json');

function readDb() {
  const dbRaw = fs.readFileSync(dbPath);
  return JSON.parse(dbRaw);
}

export default function handler(req, res) {
  const db = readDb();

  if (req.method === 'GET') {
    res.status(200).json({
      stats: db.dashboardStats,
      recentActivity: db.recentActivity,
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
