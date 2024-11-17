// authMiddleware.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized


const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];  // Get the token from the Authorization header

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;  // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).send('Unauthorized');
    }
};

module.exports = verifyToken;
