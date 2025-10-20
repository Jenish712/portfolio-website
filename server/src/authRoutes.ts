import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router: Router = Router();

router.post('/login', (req, res) => {
  const { id, key } = req.body || {};
  const adminId = process.env.DEV_ADMIN_ID || 'admin';
  const adminKey = process.env.DEV_ADMIN_KEY || 'admin';
  if (id !== adminId || key !== adminKey) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ sub: id, role: 'admin' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '2h' });
  res.json({ token });
});

export default router;
