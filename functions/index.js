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
    console.log(body.userId);
    delete body.userId;

    let orderRef = admin.database().ref('userOwner/' + userId + '/orders');
    let cartRef = admin.database().ref('userOwner/' + userId + '/cart');

    return orderRef.push(req.body)
        .then((snapshot) =>{
            cartRef.remove()
            .then((snap) =>{
                console.log(snap);
                res.status(200).send("ok");
            }).catch((error) =>{
                console.log(error);
                orderRef.remove()
                .then((snap) => {
                    res.status(500).send("error ao limpar carrinho");
                }).catch((error) => {
                    res.status(500).send("error ao apagar pedido");
                });
            });            
        }).catch((error) => {
            console.log(error);
            res.status(500).send("error ao realizar pedido");
        });
    
}

exports.finishOrder = functions.https.onRequest((req, res) => {
    return cors(req, res, function(){
        finishOrderFn(req, res);
    });        
});