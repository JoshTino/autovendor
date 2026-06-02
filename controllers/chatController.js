const Client = require('../models/clientModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Enterprise = require('../models/enterpriseModel');

const downloadImage = require('../helpers/downloadImage');
const cloudinary = require('../services/cloudinary');

const fs = require("fs");
const twilio = require("twilio");
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const chatController = async (app) => {

	

	app.post('/webhook', async (req, res) => {
	const msg = req.body.Body?.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
	const name = req.body.ProfileName || "Customer";
	const phone = req.body.WaId;
	let response = '';
	const twiml = new twilio.twiml.MessagingResponse();

	let numMedia = Number(req.body.NumMedia);


	let enterprise = await  Enterprise.findOne({phone});
	let currentState;


	if (enterprise) {
		currentState = enterprise.state;
	} else {
		currentState = "visitor_menu";
	}
	console.log(currentState);
	console.log(msg.length);

	if (msg === "hi") {

		if (!enterprise) {

		response = `
1️⃣ Link business to AutoVendor
2️⃣ Renew Subscription
3️⃣ Speak to a Representative

Reply with the *number* proceed.
		`;

		} else {
			enterprise.state = "user_menu";
			await enterprise.save();
			response = `
1️⃣ Add Products
2️⃣ View Store
3️⃣ View Order(s)
4️⃣ Renew Subscription
5️⃣Speak to a Representative

Reply with the *number* to proceed.
		`;
		}

	} else if (msg === "1" && currentState === "visitor_menu") {
		const onboardEnterprise = await Enterprise.create({phone});
		if (onboardEnterprise) {
			onboardEnterprise.state = "user_menu";
			await onboardEnterprise.save();

			response = `
🎉 *Welcome to AutoVendor!*

Your WhatsApp number has been successfully linked to the AutoVendor system. ✅

Your business can now:
🛍️ Display products automatically
📦 Receive customer selections instantly
🧾 Generate invoices in chat
⚡ Respond to customers 24/7

To get started, upload your products and set your pricing.

Reply with:
1️⃣ Add Products
2️⃣ View Store
3️⃣ Settings
4️⃣ Support

Thank you for choosing *AutoVendor* 🚀

			`;
		}


	} else if (msg === "1" && (currentState === "user_menu" || currentState === "set_price" || currentState === "get_sample")) {

		//Generate random ID to be used for both product and enterprise
		const upload_id = Math.random().toString(36).substring(2);

		//Create Product document with only uploadId field
		await Product.create({phone: phone, uploadId: upload_id, description: null});

		//Assign new uploadId state to enterprise
		enterprise.uploadId = upload_id;
		enterprise.state = "get_sample";
		await enterprise.save();
		response = `
1️⃣ *Copy product description sample, replace with the details of your product, add image(s) and send*
			_One sample for One product_

Reply with *1* to get sample OR if you already know the formart, go ahead and do it
		`;
	} /*else if (msg === "1" && currentState === "get_sample") {
		enterprise.state = "add_product";
		await enterprise.save();

		response = `
_Body Wave_
_16 inches_
_Honey Blonde (99J)_
_230g_
_13x4 Closure_
_₦467,000_
		`;
	}*/ else if ((msg.length === 0 || msg.length > 25) && (currentState === "get_sample" || currentState === "add_product")) {
		enterprise.state = "set_price";
		await enterprise.save();


		if (numMedia > 0) {


			try {

				const uploadId = (await Enterprise.findOne({phone}))?.uploadId;

				const orderCode = Math.random().toString(36).substring(2);
				const message = req.body.Body;

				/*Condition below fix the issue of empty description field on DB*/
				// If message length greater than 10, update the all the field
				if (message.length > 10) {

					const productUpdate = await Product.findOneAndUpdate(
						{uploadId: uploadId},
						{ $set: {phone: phone, description: message, orderCode: orderCode}}
					);

				// If message length less than 10, update all field except the description field	
				} else {
					const productUpdate = await Product.findOneAndUpdate(
						{uploadId: uploadId},
						{ $set: {phone: phone, orderCode: orderCode}}
					);
				}


				let newProduct = await Product.findOne({uploadId});

				for (let i = 0; i < numMedia; i++) {
					const imageUrl = req.body[`MediaUrl${i}`];
					const filepath = `./uploads/${Date.now()}-${i}.jpg`;

					await downloadImage(imageUrl, filepath);

					const cloudinaryUrl = await cloudinary.uploader.upload(filepath);

					if (newProduct) {
						newProduct.images.push(cloudinaryUrl.secure_url);
						await newProduct.save();
					}
					
					fs.unlinkSync(filepath);
				}

			} catch (err) {
				console.log(err);
			}

			
		}

			if (msg.length > 10) {
				response = `
Enter price
_Eg 15000 or 495000_
`;
			}


	} else if (msg.length > 1 && currentState === "set_price") {
		const uploadId = (await Enterprise.findOne({phone}))?.uploadId;
		await Product.findOneAndUpdate(
			{uploadId: uploadId},
			{ $set: {price: msg}}
		);
		response = `✅ Your item was added
Reply with *1* to add new item.
`;
	} else if (msg === "2") {
		enterprise.state = "view_store";
		await enterprise.save();

		// const twiMsg = twiml.message();

		const items = await Product.find({}).sort({createdAt: -1}).limit(1);

		for (const item of items) {
			await client.messages.create({
				from: "whatsapp:+14155238886",
				to: "whatsapp:+2348069249696",
				body: `
					${item.description}\n\n*Price:* ₦${item.price}\n\nMore photos: https://autovendor.shop/product/123\n

*Pay To:* 
_[Monify Account]_
*0762991937*
----------------------------------------------
----------------------------------------------
ℹ️ _Reply with *confirm* after payment_
----------------------------------------------
				`,
				mediaUrl: [item.images[0], item.images[1]]
			});

		}

			// twiMsg.body(`${item.description}\n\nPrice: ₦357,000\n\nMore photos: https://autovendor.shop/product/123`);
			// twiMsg.media(item.images[0]);			


	} else if (msg === "5" ) {
		enterprise.state = "get_support";
		await enterprise.save();
		response = `
*Our Contacts are below:*

📞	Phone NO: *08069249696*
💬	WhatsApp Chat: *08069249696*
📧	Email: support@autovendor.com

We are ready to assist you!! 👌🏾
		`;
	} else if (msg === "0") {
		enterprise.state = "user_menu";
		await enterprise.save();

		response = `
1️⃣ Add Products
2️⃣ View Store
3️⃣ View Order(s)
4️⃣ Renew Subscription
5️⃣Speak to a Representative

Reply with the *number* proceed.
		`;		
	}

	 res.set('Content-Type', 'text/xml');
	 res.send(`<Response><Message>${response}</Message></Response>`);

	// res.type("text/xml");
	// res.send(twiml.toString());

	///res.sendStatus(200);
});



}

module.exports = chatController;