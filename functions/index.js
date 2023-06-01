/* eslint-disable */


const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotification = functions.firestore
  .document("posts/{postId}")
  .onCreate(async (snapshot) => {
    const post = snapshot.data();
    const { title, body } = post;

    // Get the FCM tokens of all users
    const tokensSnapshot = await admin.firestore().collection("users").get();
    const tokens = tokensSnapshot.docs.map((doc) => doc.data().fcmToken);

    // Construct the notification payload
    const payload = {
      notification: {
        title: "New Post",
        body: `${title}: ${body}`,
      },
    };

    // Send the notification to all users
    await admin.messaging().sendToDevice(tokens, payload);
  });
