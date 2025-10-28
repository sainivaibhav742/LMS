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
    res.status(200).json(db.payments);
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    let updatedPayment = null;
    db.payments = db.payments.map(payment => {
      if (payment.id === parseInt(id)) {
        updatedPayment = { ...payment, ...req.body };
        return updatedPayment;
      }
      return payment;
    });
    if (updatedPayment) {
      writeDb(db);
      res.status(200).json(updatedPayment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
