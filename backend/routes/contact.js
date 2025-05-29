import express from 'express';
import { addQuery } from '../controller/contactController.js';

const router = express.Router();

router.post('/add', addQuery);

export default router;
