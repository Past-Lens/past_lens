import { Request, Response, NextFunction } from "express";
import zxcvbn from "zxcvbn";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const checkEmailAndUsernameReuse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, username } = req.body;

  const existingUser = await client.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email or username already in use" });
  }

  next();
};

// Check password strength using zxcvbn
export const checkPasswordStrength = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password } = req.body;
  const result = zxcvbn(password);

  if (result.score < 3) {
    return res
      .status(400)
      .json({ message: "Password is too weak. Try making it stronger." });
  }

  next();
};
