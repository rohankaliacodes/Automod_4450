const bcrypt = require('bcrypt');

const registerUser = async (req, res, Users) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const user = await Users.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Users.insertOne({ username, email, password: hashedPassword, garage: [] });

        res.status(200).json({ message: 'User registered', status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUsername = async (req, res, Users) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.status(200).json({ status: 'ok', username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteAccount = async (req, res, Users) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        await Users.deleteOne({ email });
        res.status(200).json({ message: 'Account deleted', status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { registerUser, getUsername, deleteAccount };
