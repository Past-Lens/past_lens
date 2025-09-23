import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary";

const client = new PrismaClient();


export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { firstName, lastName, email, username } = req.body;

    const updatedUser = await client.user.update({
      where: { id: userId },
      data: { firstName, lastName, email, username },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Generate upload signature for Cloudinary
 * @route GET /api/user/avatar-signature
 * @access Private
 */
export const getAvatarUploadSignature = async (req: Request, res: Response) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "user_avatars";

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    );

    res.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not generate signature" });
  }
};

/**
 * @desc Save uploaded avatar URL from frontend
 * @route PUT /api/user/avatar
 * @access Private
 */
export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { avatar } = req.body; // secure_url from frontend

    if (!avatar) {
      return res.status(400).json({ message: "Avatar URL is required" });
    }

    const updatedUser = await client.user.update({
      where: { id: userId },
      data: { avatar },
      select: { id: true, avatar: true, updatedAt: true },
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Avatar update failed" });
  }
};


export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { oldPassword, newPassword } = req.body;

    const user = await client.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await client.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    await client.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        email: `deleted_${userId}@example.com`,
        username: `deleted_${userId}`,
      },
    });

    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
