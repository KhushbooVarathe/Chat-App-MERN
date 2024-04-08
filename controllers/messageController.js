const chatModel = require('../models/chatModel');
const MessageModel = require('../models/messageModel');
const userModel = require('../models/userModel');

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    try {
        if (!content || !chatId) {
            console.log("Invalid data passed into request");
            return res.status(400).send("Invalid data passed into request");
        }
        
        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId
        };

        // Create new message
        let message = await MessageModel.create(newMessage);
        // console.log('message1: ', message);
        
        // Populate sender and chat fields in the message
        message = await MessageModel.populate(message, { path: 'sender', select: 'name picture' });
        // console.log('message2: ', message);
        message = await MessageModel.populate(message, { path: 'chat' });
        // console.log('message3: ', message);
        
        // Populate users in the chat
        message = await userModel.populate(message, {
            path: 'chat.users',
            select: 'name picture email'
        });

        // Update latest message in chatModel
        await chatModel.findByIdAndUpdate(chatId, {
            latestMessage: message
        });

        // console.log('Message sent:', message);
        res.json(message);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send("Error occurred while sending message");
    }
};

const allMessages=async(req,res)=>{
    // console.log('req: ', req.params.chatId);
    try {
        const messages=await MessageModel.find({chat:req.params.chatId}).populate("sender","name picture email")
        .populate("chat")
        // console.log('messages: ', messages);
        res.send(messages)
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send("Error occurred while sending message");        
    }

}

module.exports = { sendMessage,allMessages };
