// config/firebase.js
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE);
//const serviceAccount = require('../firebase_creds.json'); // Replace with the path to your Firebase Admin SDK credentials file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;
