// const getParts = async (req, res, PartsList) => {
//     try {
//         const parts = await PartsList.find({}).toArray();
//         res.status(200).json({ status: 'ok', parts });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// module.exports = { getParts };


const Part = require('../models/partsModel');

const getParts = async (req, res) => {
    try {
        const parts = await Part.find(); // Fetch all parts
        res.status(200).json({ status: 'ok', parts });
    } catch (err) {
        console.error('Error fetching parts:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getParts };
