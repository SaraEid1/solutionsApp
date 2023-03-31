const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");

admin.initializeApp();

exports.createProfile = functions.auth.user().onCreate((user) => {
  // Add a new document to the "profiles" collection
  return admin.firestore().collection("profiles").doc(user.uid).set({
    email: user.email,
    // add any other fields you want to save for the user
  });
});
