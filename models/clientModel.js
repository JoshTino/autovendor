const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"));

const clientSchema = new mongoose.Schema({
	name: String,
	phone: String,
	state: {
		type: String,
		enum: ["menu" ,"view_available_wigs", "price_list", "place_order", "speak_to_a_representative", "pick_color"],
		default: "menu"
	}
}, {timestamps: true});

module.exports = mongoose.model("Client", clientSchema);