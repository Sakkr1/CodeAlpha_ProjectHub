import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { User, IUserDoc } from './auth.model.js';
import { AppError } from '../../shared/errors.js';

function generateToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });
}

function toUserJSON(user: any) {
  return { _id: user._id.toString(), email: user.email, name: user.name, theme: user.theme, createdAt: user.createdAt, updatedAt: user.updatedAt };
}

export async function register(email: string, password: string, name: string) {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError(409, 'Email already registered');

  const user = await User.create({ email, password, name });
  const token = generateToken(user._id.toString());
  return { user: toUserJSON(user), token };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(401, 'Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError(401, 'Invalid email or password');

  const token = generateToken(user._id.toString());
  return { user: toUserJSON(user), token };
}

export async function updateTheme(userId: string, theme: 'light' | 'dark') {
  const user = await User.findByIdAndUpdate(userId, { theme }, { new: true });
  if (!user) throw new AppError(404, 'User not found');
  return toUserJSON(user);
}
