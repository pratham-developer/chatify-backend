// models/messageModel.js
const mongoose = require('mongoose');

// Message schema for storing chat messages
const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema,'chats');

module.exports = Message;
