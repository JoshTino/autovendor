
const orderSchema = new mongoose.Schema({
	clientId: {
		type: mongoose.Schema.Type.ObjectId,
		ref: "Client"
	},
	hair_type: String,
	hair_color: String,
	hair_length: String,
	status: {
		type: String,
		enum: ["processing", "completed", "cancelled", "shipped", "ready_for_collection"],
		default: "processing"
	}
}, {timestamps: true});

module.exports = mongoose.model("Order", orderSchema);