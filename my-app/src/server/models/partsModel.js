const mongoose = require('mongoose');

const PartSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    price: { type: String, required: true },
    SKU: { type: String, required: true },
    category: { type: String, required: true },
});

module.exports = mongoose.model('Part', PartSchema);


