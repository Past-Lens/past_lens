import express, { Application, Request, Response } from 'express';
import connectDB from './config/db';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import chatRouter from './routes/chat.route';
import datasetRouter from './routes/dataset.route';
import draftRouter from './routes/draft.route';
import artifactRouter from './routes/artifact.routes';
import discoverRouter from './routes/discoverRoute';
import aiRouter from './routes/ai.routes';
import proverbsRouter from './routes/proverbs';

import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const app: Application = express();
const origins = ['http://localhost:5173', 'https://pastlens.vercel.app'];

app.use(cors({ credentials: true, origin: origins }));
app.use(express.json());

// -------------------- Root route --------------------
app.get('/', (_req: Request, res: Response) => {
    res.send('API is running...');
});

// -------------------- Existing routes --------------------
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/dataset', datasetRouter);
app.use('/api/draft', draftRouter);
app.use('/api/artifacts', artifactRouter);
app.use('/museum', artifactRouter); // Cultural discovery route
app.use('/api/museum', discoverRouter);
app.use('/ai', aiRouter);
app.use('/api/proverbs', proverbsRouter);

// -------------------- Start server --------------------
const port: number = parseInt(process.env.PORT!) || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
