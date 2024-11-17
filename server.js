// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const chatRoutes = require('./routes/chatRoutes');
const Message = require('./models/messageModel');
const connectDB = require('./config/mongo');
const admin = require('./config/firebase');
const dotenv = require('dotenv');
const cors = require('cors');
const chatRoomRoutes = require('./routes/chatRoomRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/chatroom', chatRoomRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO authentication middleware
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        socket.user = decodedToken;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.uid}`);

    // Send previous messages
    socket.on('fetchMessages', async ({ page = 1, limit = 50 } = {}) => {
        try {
            const messages = await Message.find()
                .sort({ timestamp: -1 })
                .limit(limit)
                .lean();

            socket.emit('previousMessages', messages.map(msg => ({
                text: msg.text,
                senderId: msg.senderId,
                senderName: msg.senderName,
                timestamp: msg.timestamp.toISOString()
            })));
        } catch (error) {
            console.error('Error fetching messages:', error);
            socket.emit('error', { message: 'Failed to fetch messages' });
        }
    });

    // Handle new messages
    socket.on('newMessage', async (messageData) => {
        try {
            const newMessage = new Message({
                text: messageData.text,
                senderId: socket.user.uid,
                senderName: messageData.senderName,
                timestamp: new Date()
            });

            await newMessage.save();
            
            // Emit the saved message to all clients
            io.emit('message', {
                text: newMessage.text,
                senderId: newMessage.senderId,
                senderName: newMessage.senderName,
                timestamp: newMessage.timestamp.toISOString()
            });
        } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('error', { message: 'Failed to save message' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.uid}`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        mongoose.connection.close(false, () => {
            process.exit(0);
        });
    });
});