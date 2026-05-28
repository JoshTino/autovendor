const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	phone: String,
	description: String,
	images: Array, 
	orderCode: String,
	uploadId: String,
	price: Number
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);