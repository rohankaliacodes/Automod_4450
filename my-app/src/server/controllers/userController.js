const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res, Users) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Check if user already exists
        const user = await Users.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password and insert user
        const hashedPassword = await bcrypt.hash(password, 10);
        await Users.insertOne({ username, email, password: hashedPassword, garage: [] });

        res.status(200).json({ message: 'User registered', status: 'ok' });
    } catch (err) {
        console.error('Error in registerUser:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get username by email
const getUsername = async (req, res, Users) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ status: 'ok', username: user.username });
    } catch (err) {
        console.error('Error in getUsername:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a user account
const deleteAccount = async (req, res, Users) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find and delete user
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Users.deleteOne({ email });
        res.status(200).json({ message: 'Account deleted', status: 'ok' });
    } catch (err) {
        console.error('Error in deleteAccount:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    registerUser,
    getUsername,
    deleteAccount,
};
