import app from './app2.js'; // Import the configured app
const port = process.env.PORT || 5001;
import dotenv from 'dotenv'

dotenv.config()

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
