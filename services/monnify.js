//MONNIFY ACCESS TOKEN GENERATION CODE
const generateMonnifyAccessToken = async () => {

	const response = await fetch('https://sandbox.monnify.com/api/v1/auth/login', {
		method: 'POST',
		headers: {
		Authorization: 'Basic TUtfVEVTVF9HQzNCOFhHMlhYOkE2NjNOUlpBNTQ0RERQRU03S0RON1o4SFJWNllYRDhT'
		}
	});

	const result = await response.json();
	console.log(result);

}


const generateMonnifyDynamicAccountNumber = async (amount, email) => {

	//MONNIFY TRANSACTION INITIALIZATION
	const initializationResponse = await fetch('https://sandbox.monnify.com/api/v1/merchant/transactions/init-transaction', {
	  method: 'POST',
	  headers: {
	    Authorization: `Bearer ${process.env.MONNIFY_ACCESS_TOKEN}`,
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
	    amount: `${amount}`,
	    customerEmail: `${email}`,
	    paymentReference: `REF_${Date.now()}`,
	    paymentDescription: 'Trial transaction',
	    currencyCode: 'NGN',
	    contractCode: '5867418298',
	    redirectUrl: 'https://my-merchants-page.com/transaction/confirm',
	    paymentMethods: ['CARD',   'ACCOUNT_TRANSFER',   'USSD',   'PHONE_NUMBER'],
	    metadata: {
	      name: 'John Doe',
	      age: 45
	    }
	  })
	});

	const initializationData = await initializationResponse.json();
	//console.log(initializationData);

	//GENERATE DYNAMIC ACCOUNT NUMBER
	const response = await fetch('https://sandbox.monnify.com/api/v1/merchant/bank-transfer/init-payment', {
		  method: 'POST',
		  headers: {
		    Authorization: `Bearer ${process.env.MONNIFY_ACCESS_TOKEN}`,
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		    transactionReference: `${initializationData.responseBody.transactionReference}`,
		    bankCode: '058'
		  })
	});

	const data = await response.json();
	console.log(data);

	return data;

}

const getMonnifyTransactionStatus = async (transactionReference) => {
	const response = fetch(`https://sandbox.monnify.com/api/v2/transactions/${transactionReference}`, {
	  headers: {
	    Authorization: `Bearer ${process.env.MONNIFY_ACCESS_TOKEN}`
	  }
	});

	const data = await response.json();
	console.log(data);
}


module.exports = {generateMonnifyAccessToken, generateMonnifyDynamicAccountNumber, getMonnifyTransactionStatus}