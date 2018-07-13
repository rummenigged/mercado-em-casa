const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.addWelcomeMessage = functions.auth.user().onCreate(event => {
    const user = event.data;
    return console.log('A new user signed in for the app. ' + user);
});

exports.createOrder = functions.database.ref('/userOwner/{userId}/cart').onUpdate(event =>{
    console.log("Updated");
   return console.log(event);
});