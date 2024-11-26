const getParts = async (req, res, PartsList) => {
    try {
        const parts = await PartsList.find({}).toArray(); // Fetch all parts from the collection
        res.status(200).json({ status: 'ok', parts });
    } catch (err) {
        console.error('Error fetching parts:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getParts };
