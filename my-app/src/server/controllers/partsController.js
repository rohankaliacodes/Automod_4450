const fs = require('fs');
const path = require('path');
const addedParts = new Set();

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

const searchPartsByName = async (req, res) => {
    const { partName } = req.body;

    const filePath = path.join(__dirname, `../partsFiles/`);
    if (!partName) {
        return res.status(400).json({ status: "error", message: "Please provide a part name" });
    }

    const results = [];

    const searchFiles = (dir) => {
        console.log("Searching directory:", dir);
        const files = fs.readdirSync(dir);


        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                searchFiles(filePath);
            } else if (path.extname(file) === '.json') {
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    const jsonData = JSON.parse(data);

                    if (Array.isArray(jsonData)) {
                        jsonData.forEach(part => {
                            const key = part["Part Name"];
                            if (part["Part Name"].toLowerCase().includes(partName.toLowerCase()) || part["SKU Number"].includes(partName)) {
                                if(!addedParts.has(key)) {
                                    results.push(part);
                                    addedParts.add(key);
                                }
                                
                            }
                        });
                    } 
                } catch (error) {
                    console.log(`Error reading file: ${filePath}`, error);
                }
            } 
        });
    };

    try {
        searchFiles(filePath);

        if (results.length === 0) {
            return res.status(404).json({ status: "error", message: "No matching parts found" });
        }

        return res.status(200).json({ status: "ok", data: results });
    } catch (err) {
        console.error("Error during file search:", err);
        return res.status(500).json({ status: "error", message: "Internal server error", error: err.message });
    }
};


module.exports = { getParts, searchPartsByName};
