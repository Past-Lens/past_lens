import express, { Application, Request, Response } from 'express';
import connectDB from './config/db';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import chatRouter from './routes/chat.route';
import cors from 'cors';

connectDB();

const app: Application = express();

const origins = ['http://localhost:5173'];

app.use(
    cors({
        credentials: true,
        origin: origins,
    })
);

app.use(express.json());

const port: number = parseInt(process.env.PORT!);

app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);

app.listen(port, () => console.log(` Server running on port ${port}`));
