const Client = require('../models/Client');
const Order = require('../models/orderModel');


const chatController = async (app) => {



	app.post('/webhook', async (req, res) => {
	const msg = req.body.Body?.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
	const name = req.body.ProfileName || "Customer";
	const phone = req.body.WaId;
	let response = '';

	//console.log(req.body);


	let client = await Client.findOne({ phone });

	if (!client) {
		client = await Client.create({
			name,
			phone,
		});
	}

	const currentState = client.state;

	if (msg === "hi" && currentState === "menu") {
		client.state = "menu";
		await client.save();

		response = `*Hi ${name}, Welcome to CrownLux Hair 👑*

We offer premium quality wigs tailored to perfection 💇‍♀️

Please select an option:

1️⃣ View Available Wigs  
2️⃣ Price List  
3️⃣ Place Order  
4️⃣ Speak to a Representative`;
	} else if (msg === '1' && currentState === "menu") {
		client.state = "view_available_wigs";
		await client.save();

		response = `*💇‍♀️ Available Wigs:*
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ---
1️⃣ 12" Bone Straight – ₦35,000
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ---
2️⃣ 14" Curly – ₦40,000  
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ---
3️⃣ 16" Frontal – ₦55,000
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ---
4️⃣ 18" Body Wave – ₦65,000 
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ---

All wigs are:
✅ 100% Human Hair  
✅ Tangle-Free  
✅ Long-lasting  

Reply with the *number* to proceed`;

	} else if (currentState === "view_available_wigs" && ["1", "2", "3", "4"].includes(msg)) {
		client.state = 'pick_color';
		await client.save();
		const hair = "```Bone Straight```";
		const color = "```Natural Black```";
		const length = "```12 inches```";

		response = `
					*You Are About To Order*
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ---    
| -Hair: ${hair}
| -Color: ${color}
| -Length: ${length}
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ---
		`;

	} else if (currentState === "pick_color" && ["1", "2", "3", "4"].includes(msg)) {
		response = `*💰 Price List:*

12" Bone Straight – ₦35,000  
14" Curly – ₦40,000  
16" Frontal – ₦55,000  
18" Body Wave – ₦65,000  

📦 Nationwide delivery available  

Reply with *3* to place your order`;

	} else if (currentState === "place_order") {
		response = `*📝 Place Your Order*

Kindly send your details in this format:

*Type:* (e.g. Bone Straight)  
*Length:* (e.g. 14 inches)  
*Color:* (e.g. Natural Black)  
*Location:* (Delivery address)

Our team will process your order immediately 💖`;

	} else {
		response = `*🤝 Customer Support*

A representative will attend to you shortly.

You can also call or WhatsApp:
📞 080XXXXXXXX

Thank you for your patience 💖`;
	}

	res.set('Content-Type', 'text/xml');
	res.send(`<Response><Message>${response}</Message></Response>`);
	console.log(currentState);
});
}

module.exports = chatController;