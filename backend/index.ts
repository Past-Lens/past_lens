import express from 'express';
import { configDotenv } from 'dotenv';

const app =  express();
configDotenv();
app.use(express.json());

const port = process.env.PORT || 5000;
console.log(port);
app.listen(port, ()=> console.log(`Server running on port ${port}`));

