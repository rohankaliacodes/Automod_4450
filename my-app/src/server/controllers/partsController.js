import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { dirname } from 'path'; // Import dirname

const __filename = fileURLToPath(import.meta.url); // Get the current filename
const __dirname = dirname(__filename); // Get the current directory


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

const getRecommendations = async (req, res) => {
    const { cars } = req.body;
    if(!cars || cars.length === 0){
        return res.status(400).json({ status: "error", message: "Please provide car data" });
    }
    try {
        let recommendations = [];
        for (const car of cars){
            const filePath = path.join(__dirname, `../partsFiles/${car.make}/${car.make} ${car.model}/${car.year} ${car.make} ${car.model} ${car.trim} ${car.engine}.json`);

            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath, 'utf8');
                const parts = JSON.parse(fileData);

                if(parts.length > 0){
                    const part = parts[Math.floor(Math.random() * parts.length)];
                    recommendations.push({
                    car: {
                        make: car.make,
                        model: car.model,
                        year: car.year,
                        trim: car.trim,
                        engine: car.engine
                    },
                        part
                });
                }

            }
        }
        res.json({ status: "ok", data: recommendations });
    } catch (error) {
        console.log("Error getting recommendations:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};



const searchPartsByName = async (req, res) => {
    const { partName } = req.body;

    const filePath = path.join(__dirname, `../partsFiles/`);
    if (!partName) {
        return res.status(400).json({ status: "error", message: "Please provide a part name" });
    }

    const results = []; // Reinitialize results for each request
    const addedParts = new Set(); // Reinitialize addedParts for each request

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
                            if (
                                typeof part["Part Name"] === "string" &&
                                part["Part Name"].toLowerCase().includes(partName.toLowerCase()) ||
                                (typeof part["SKU Number"] === "string" && part["SKU Number"].includes(partName))
                            ) {
                                if (!addedParts.has(key)) {
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

        if (results.length > 0) {
            res.status(200).json({ status: "ok", data: results });
        } else {
            res.status(404).json({ status: "error", message: "No parts found" });
        }
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


const getAllParts = async (req, res) => {
    const partsDirectory = path.join(__dirname, `../partsFiles/`);
    let results = [];

    const readFiles = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                readFiles(filePath);
            } else if (path.extname(file) === '.json') {
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    const jsonData = JSON.parse(data);

                    if(Array.isArray(jsonData)) {
                        results = results.concat(jsonData);
                    }
                } catch (error) {
                    console.log(`Error reading file: ${filePath}`, error);
                }
            }
        })
    };
    try {
        readFiles(partsDirectory);
        if (results.length > 0) {
            res.status(200).json({ status: "ok", data: results });
        } else {
            res.status(404).json({ status: "error", message: "No parts found" });
        }
    } catch(error){
        console.log("Error during search:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

export { getParts, searchPartsByName, getAllParts, getRecommendations };