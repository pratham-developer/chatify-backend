// routes/chatRoomRoutes.js
const express = require('express');
const ChatRoom = require('../models/chatRoomModel');
const router = express.Router();



// Verify Chat Room PIN
router.post('/verify-pin', async (req, res) => {
    const { pin } = req.body;

    if (!pin) {
        return res.status(400).json({ error: 'PIN is required' });
    }

    try {
        const chatRoom = await ChatRoom.findOne({ pin });

        if (chatRoom) {
            return res.status(200).json({valid:true
            });
        } else {
            return res.status(401).json({ valid:false
             });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
