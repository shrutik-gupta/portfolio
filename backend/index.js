const express = require('express');
const connectToDatabase = require('./db/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const contactRouter = require('./routes/contact');
const chatRouter = require('./routes/chat');

dotenv.config();
connectToDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/query', contactRouter);
app.use('/chat', chatRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.BASE_URL}`);
});
