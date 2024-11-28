const fs = require('fs');
const path = require('path');

const getParts = async (req, res) => {
    const { make, model, year, trim, engine } = req.body;

    // Construct the file name and path
    const fileName = `${year} ${make} ${model} ${trim} ${engine}.json`;
    const filePath = path.join(__dirname, `../partsFiles/${make}/${make} ${model}/${fileName}`);

    // Read the file from the filesystem
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ message: 'File not found', error: err });
        }
        res.status(200).json({ message: 'File found', data: JSON.parse(data), status: "ok" });
    });
};

module.exports = { getParts };
