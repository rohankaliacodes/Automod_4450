const express = require('express');
const { getParts } = require('../controllers/partsController');

const router = express.Router();
const PartsList = connectDB().then(db => db.collection('Parts'));

router.get('/getParts', (req, res) => getParts(req, res, PartsList));

module.exports = router;
