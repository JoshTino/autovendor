const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"));

const clientSchema = new mongoose.Schema({
	name: String,
	phone: String,
	email: String,
	state: {
		type: String,
		enum: [
			"add_email",
			"confirm_payment",
			"show_account_details"
		],
		default: "add_email"
	},
	lastOrderCode: String
}, {timestamps: true});

module.exports = mongoose.model("Client", clientSchema);