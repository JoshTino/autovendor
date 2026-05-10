require("dotenv").config();
const chatController = require('./controllers/chatController.js');

const express = require("express");

const app = express();

app.use(express.urlencoded({extended: false}));

chatController(app);


app.listen(process.env.PORT, () => {console.log("Server runnig @ port 5000")});


