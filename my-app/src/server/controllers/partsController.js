const getParts = async (req, res, PartsList) => {
    try {
        const parts = await PartsList.find({}).toArray();
        res.status(200).json({ status: 'ok', parts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getParts };
