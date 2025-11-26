const express = require('express');
const { addQuery } = require('../controller/contactController');

const router = express.Router();

router.post('/add', addQuery);

module.exports = router;
