import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { authenticate } from '../middleware/authMiddleware';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { loginId, password } = req.body;
    if (!loginId || !password) {
      res.status(400).json({ success: false, error: 'Login ID and password are required' });
      return;
    }

    const result = await AuthService.login(loginId, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message || 'Login failed' });
  }
});

// GET /api/auth/me
authRouter.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getCurrentUser(req.user!.id);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});
