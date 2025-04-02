import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const ADMIN_USERNAME = 'apple';
const ADMIN_PASSWORD = 'apple';

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: '24h' }
  );

  res.json({ token });
}; 