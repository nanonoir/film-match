import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import { userService } from '../services/user.service';
import { UpdateUserDto } from '../validators/user.validator';

export class UserController {
  /**
   * GET /api/users/me
   */
  async getUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.user!.userId as any);
      const user = await userService.getUserProfile(userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/me
   */
  async updateUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.user!.userId as any);
      const dto: UpdateUserDto = req.body;

      const user = await userService.updateUserProfile(userId, dto);

      res.json({
        success: true,
        data: user,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/me/stats
   */
  async getUserStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.user!.userId as any);
      const stats = await userService.getUserStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();