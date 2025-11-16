import { z } from 'zod';

export const updateUserSchema = z.object({
  username: z.string().min(3, 'username must be at least 3 characters').max(50, 'username must be at most 50 characters').optional(),
  profilePicture: z.string().url('profilePicture must be a valid URL').optional(),
});

export const categorySlugSchema = z.object({
  slug: z.string().min(1, 'slug must not be empty')
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type CategorySlugParams = z.infer<typeof categorySlugSchema>;