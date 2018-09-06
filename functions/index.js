// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

const cors = require('cors')({
  origin: true,
});

admin.initializeApp(functions.config().firebase);

exports.addWelcomeMessage = functions.auth.user().onCreate(event => {
    const user = event.data;
    return console.log('A new user signed in for the app. ' + user);
});

exports.createOrder = functions.database.ref('/userOwner/{userId}/cart').onUpdate(event =>{
    console.log("Updated");
   return console.log(event);
});


let finishOrderFn = function finishOrderFn(req, res){
    let body = req.body;
    let userId = body.userId;
    delete body.userId;
    return admin.database()
        .ref('userOwner/' + userId + '/orders')
        .push(req.body)
        .then((snapshot) =>{
            res.status(200).send("ok");
        });
    
}

exports.finishOrder = functions.https.onRequest((req, res) => {
    return cors(req, res, function(){
        finishOrderFn(req, res);
    });        
});