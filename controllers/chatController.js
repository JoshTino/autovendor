const Client = require('../models/Client');


const chatController = async (app) => {



	app.post('/webhook', async (req, res) => {
	const msg = req.body.Body?.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
	const name = req.body.ProfileName || "Customer";
	const phone = req.body.WaId;
	let response = '';
	let currentState = null;

	//console.log(req.body);


	const client = await Client.findOne({ phone });

	if (!client) {
		 await Client.create({
			name,
			phone,
		});
	}
	


	if (msg === "hi" || msg === "hello") {
		response = `*Hi ${name}, Welcome to CrownLux Hair 👑*

We offer premium quality wigs tailored to perfection 💇‍♀️

Please select an option:

1️⃣ View Available Wigs  
2️⃣ Price List  
3️⃣ Place Order  
4️⃣ Speak to a Representative`;
	} else if (msg === '1') {
		client.state = "view_available_wigs";
		await client.save();
		currentState = (await Client.findOne( {phone} ).select('state'))?.state;
		response = `*💇‍♀️ Available Wigs:*

1️⃣ 12" Bone Straight  
2️⃣ 14" Curly  
3️⃣ 16" Frontal  
4️⃣ 18" Body Wave  

All wigs are:
✅ 100% Human Hair  
✅ Tangle-Free  
✅ Long-lasting  

Reply with the *number* or *name* to proceed`;
	} else if (msg === '2') {
		client.state = "price_list";
		await client.save();
		currentState = (await Client.findOne( {phone} ).select('state'))?.state;
		response = `*💰 Price List:*

12" Bone Straight – ₦35,000  
14" Curly – ₦40,000  
16" Frontal – ₦55,000  
18" Body Wave – ₦65,000  

📦 Nationwide delivery available  

Reply with *3* to place your order`;
	} else if (msg === '3') {
		client.state = "place_order";
		await client.save();
		currentState = (await Client.findOne( {phone} ).select('state'))?.state;
		response = `*📝 Place Your Order*

Kindly send your details in this format:

*Type:* (e.g. Bone Straight)  
*Length:* (e.g. 14 inches)  
*Color:* (e.g. Natural Black)  
*Location:* (Delivery address)

Our team will process your order immediately 💖`;
	} else if (msg === '4') {
		client.state = "speak_to_a_representative";
		await client.save();
		currentState = (await Client.findOne( {phone} ).select('state'))?.state;
		response = `*🤝 Customer Support*

A representative will attend to you shortly.

You can also call or WhatsApp:
📞 080XXXXXXXX

Thank you for your patience 💖`;
	} else {
		response = `*⚠️ Invalid Option*

Please select a valid option:

1️⃣ View Wigs  
2️⃣ Price List  
3️⃣ Place Order  
4️⃣ Speak to a Representative`;
	}


	if (currentState === "view_available_wigs" && msg === "1") {
		response = `*🔴🟢Pick Color🔵⚫️*

1️⃣ Natural Black (1B)
2️⃣ Burgundy (Color 27)
3️⃣ Honey Blonde (99J)
4️⃣ Chestnut Brown (Color 4)

Reply with the *number* to pick color
		`;
	}

	res.set('Content-Type', 'text/xml');
	res.send(`<Response><Message>${response}</Message></Response>`);
	console.log(currentState);
});
}

module.exports = chatController;