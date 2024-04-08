const express=require('express')
const app=express();
const bodyParser = require('body-parser');
const { sendMessage,allMessages } = require('../controllers/messageController');
const { authMiddleware } = require('../middleware/authMiddleware');

app.post('/message',authMiddleware,sendMessage)
app.get('/message/:chatId',allMessages)
module.exports=app;