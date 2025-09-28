import { z } from 'zod';

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
});

export const updatePasswordSchema = z.object({
    oldPassword: z
        .string()
        .min(6, 'Old password must be at least 6 characters'),
    newPassword: z
        .string()
        .min(6, 'New password must be at least 6 characters'),
});

export const uploadAvatarSchema = z.object({
    avatar: z
        .string()
        .url('Avatar must be a valid URL')
        .min(1, 'Avatar URL is required'),
});

/**
 * Delete Profile Schema
 * (kept empty for now, can add confirmation flag if needed)
 */
export const deleteProfileSchema = z.object({});
