const express = require('express');
const { registerUser, getUsername, deleteAccount } = require('../controllers/userController');
const { connectDB } = require('../config/db');

const router = express.Router();
const Users = connectDB().then(db => db.collection('Users'));

router.post('/register', (req, res) => registerUser(req, res, Users));
router.get('/getUsername', (req, res) => getUsername(req, res, Users));
router.delete('/deleteAccount', (req, res) => deleteAccount(req, res, Users));

module.exports = router;
