const functions = require("firebase-functions");
const admin = require("firebase-admin");


admin.initializeApp();
const messaging = admin.messaging();
console.log("ping recieved");

// Exported functions for Firebase Emulator Suite testing
exports.sendNotification = functions.firestore
  .document("posts/{postId}")
  .onCreate(async (snapshot) => {
    const post = snapshot.data();
    const{ title, body }= post;

    // Get the FCM tokens of all users
    const tokensSnapshot = await admin.firestore().collection("users").get();
    const tokens = tokensSnapshot.docs.map((doc) => doc.data().fcmToken);
    console.log("tokens: ", tokens)

    // Construct the notification payload
    const payload = {
      notification: {
        title: "New Post",
        body: `${title}: ${body}`,
      },
    };

    // Send the notification to all users
    // await admin.messaging().sendToDevice(tokens, payload);

    try {
      const response = await messaging.sendEach(messages);
      console.log("Notification sent successfully:", response);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });
