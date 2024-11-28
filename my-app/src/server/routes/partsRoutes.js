const express = require('express');
const { getParts } = require('../controllers/partsController');

const router = express.Router();

// Define a POST route to fetch parts
router.post('/getParts', getParts);

module.exports = router;
