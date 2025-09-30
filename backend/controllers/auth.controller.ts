import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const users = await client.user.create({
            data: {
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword,
            },
        });

        return res.status(201).json('User created succesfully');
    } catch (e) {
        console.log(e);
        return res.status(400).json('Something went wrong!');
    }
};

export const login = async (req: Request, res: Response) => {
    const { emailOrUsername, password } = req.body;

    const user = await client.user.findFirst({
        where: {
            OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
        },
    });

    if (!user)
        return res.status(400).json({ message: 'Wrong login credentials!' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
        return res.status(400).json({ message: 'Wrong login credentials!' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });

    res.json({ token });
};

export const logout = async (res: Response) => {
    //token to be deleted on the client side
    res.json({
        message: 'Logged out succesfully. Delete token on client side',
    });
};
