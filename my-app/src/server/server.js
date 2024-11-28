require('dotenv').config();
const app = require('./app2'); // Import the configured app
const port = process.env.PORT || 5001;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
