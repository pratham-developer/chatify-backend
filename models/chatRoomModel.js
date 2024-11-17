// models/chatRoomModel.js
const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    pin: {
        type: String,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema, 'chatroom');

module.exports = ChatRoom;
