import express from 'express';
import { configDotenv } from 'dotenv';

const app =  express();
configDotenv();
app.use(express.json());

const port = process.env.PORT;
app.listen(port, ()=> console.log(`Server running on port ${port}`));

