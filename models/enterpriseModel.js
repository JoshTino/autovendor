const mongoose = require("mongoose");

const enterpriseSchema = new mongoose.Schema({
	phone: String,
	plan: {
		type: String,
		enum: ["basic", "premium", "enterprise"],
		default: "basic"
	},
	state: {
		type: String,
		enum: ["visitor_menu", "user_menu", "get_sample", "add_product", "view_store", "view_orders"],
		default: "visitor_menu"
	},
	uploadId: String
}, {timestamps: true});

module.exports = mongoose.model("Enterprise", enterpriseSchema);