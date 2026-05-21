const https = require("https");
const fs = require("fs");


const downloadImage = (url, filepath) => {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(filepath);

		const options = {
			auth: `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
		};

		https.get(url, options, (response) => {

			//ERROR
			if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
				return downloadImage(response.headers.location, filepath)
				.then(resolve)
				.catch(reject);
			}

			//SUCCESS
			if (response.statusCode !== 200) {
				return Reject(
					new Error(`Failed: ${response.statusCode}`)
				);
			}

			response.pipe(file);

			file.on("finish", () => {
				file.close();
				resolve(filepath);
			});
		}).on("error", (err) => {
			fs.unlink(filepath, () => {});
			reject(err);
		});
	});
}

module.exports = downloadImage;