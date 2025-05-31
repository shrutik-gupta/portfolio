import express from 'express';
import connectToDatabase from './db/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import contactRouter from './routes/contact.js'
import chatRouter from './routes/chat.js'
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectToDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/query', contactRouter);
app.use('/api/chat', chatRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.BASE_URL}`);
});
