import { prisma } from '../lib/prisma';
import { NotFoundError } from '../utils/errors';
import { UpdateUserDto } from '../validators/user.validator';

export class UserService {
  /**
   * Obtener perfil del usuario autenticado
   */
  async getUserProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateUserProfile(userId: number, dto: UpdateUserDto) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: dto.username || user.username,
        profilePicture: dto.profilePicture || user.profilePicture
      },
      select: {
        id: true,
        email: true,
        username: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }

  /**
   * Obtener estadísticas del usuario
   */
  async getUserStats(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Obtener estadísticas en paralelo
    const [totalRatings, ratingsData, favoriteCount, watchlistCount, watchedCount] = await Promise.all([
      prisma.userRating.count({ where: { userId } }),
      prisma.userRating.findMany({
        where: { userId },
        select: { rating: true }
      }),
      prisma.userCollection.count({
        where: { userId, type: 'favorite' }
      }),
      prisma.userCollection.count({
        where: { userId, type: 'watchlist' }
      }),
      prisma.userCollection.count({
        where: { userId, type: 'watched' }
      })
    ]);

    // Calcular promedio
    const averageRating = totalRatings > 0
      ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    // Obtener categorías favoritas
    const topCategories = await prisma.userRating.findMany({
      where: { userId },
      include: {
        movie: {
          include: {
            categories: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: { rating: 'desc' },
      take: 10
    });

    // Agrupar categorías
    const categoryMap = new Map<string, number>();
    topCategories.forEach(rating => {
      rating.movie.categories.forEach(mc => {
        categoryMap.set(
          mc.category.name,
          (categoryMap.get(mc.category.name) || 0) + 1
        );
      });
    });

    const topCategoriesArray = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRatings,
      averageRating: parseFloat(averageRating.toFixed(2)),
      favoriteCount,
      watchlistCount,
      watchedCount,
      topCategories: topCategoriesArray
    };
  }
}

export const userService = new UserService();