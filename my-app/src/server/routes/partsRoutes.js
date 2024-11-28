const express = require('express');
const { getParts } = require('../controllers/partsController');
const connectDB = require('../config/db');
const Parts = require('../models/partsModel');

const router = express.Router();
connectDB();
router.get('/getParts', (req, res) => getParts(req, res, Parts));

module.exports = router;
