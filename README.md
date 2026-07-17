**AutoVendor** is a backend platform that allows businesses to create digital product listings that customers can purchase entirely through WhatsApp.

Businesses onboard to the platform, upload products with images, descriptions, and pricing, and receive unique product IDs for every listing. Instead of building websites or mobile apps, vendors simply share these product IDs with customers across any channel.

When a customer sends a product ID to the AutoVendor WhatsApp bot, the platform instantly retrieves the product and displays its complete details, including images, pricing, description, and a dynamically generated virtual bank account dedicated to that transaction.

After completing the transfer, the customer simply replies with confirm. AutoVendor automatically verifies the payment with the payment provider. Once verified, the platform generates a professionally formatted PDF proof of payment, delivers it to the customer through WhatsApp, and notifies the vendor that payment has been successfully received.

By combining conversational commerce with automated payment verification, AutoVendor eliminates manual payment confirmation and enables businesses to sell directly through WhatsApp without requiring customers to visit a website or install a mobile application.

**How It Works**

Vendor  
   │  
   ├── Creates account  
   ├── Uploads product  
   ├── Adds image, description and price  
   │  
   ▼  
AutoVendor generates Product ID  
   │  
   ▼  
Vendor shares Product ID  
   │  
   ▼  
Customer sends Product ID to WhatsApp  
   │  
   ▼  
AutoVendor displays:  
• Product image  
• Description  
• Price  
• Dynamic payment account  
   │  
   ▼  
Customer transfers payment  
   │  
   ▼  
Customer sends:  
confirm  
   │  
   ▼  
Payment verified automatically  
   │  
   ▼  
PDF receipt generated  
   │  
   ▼  
Customer receives receipt  
Vendor is notified  

### Technology Stack

**Backend**

- Node.js
- Express.js
- JavaScript

**Database**

- MongoDB

**Messaging**

Twilio(WhatsApp API) 

**Payments**

- Monnify API

**Storage**

- Cloud Storage (Cloudinary to store product images)
- Media management (Mongo Atlas)

### Development Tools
- ngrok
- Git
- GitHub
- WhatsApp
