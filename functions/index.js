const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();
console.log("ping received");

// sending notification to user email
exports.sendNotification = functions.firestore
  .document("posts/{postId}")
  .onCreate(async (snapshot) => {
    const post = snapshot.data();
    const { title, body } = post;

    let mailOptions = {
      from: "notifications@EmpowerHer.com",
      to: "", // Update with actual recipient(s) email address
      subject: `New post - ${title}`,
      text: `${body}:`,
    };

    // Get the email addresses of all users
    const usersSnapshot = await db.collection("profiles").get();
    const emails = usersSnapshot.docs.map((doc) => doc.data().email);

    if (emails.length > 0) {
      mailOptions.to = emails.join(",");
    } else {
      console.log("No user emails found");
      return;
    }

    // Create a transport object using nodemailer with your email provider credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "empowerHer.notifications@gmail.com",
        pass: "sxeujsneadlpiuym",
      },
    });

    try {
      // Send the email notification
      await transporter.sendMail(mailOptions);
      console.log("Notification email sent successfully");
    } catch (error) {
      console.error("Error sending notification email:", error);
    }
  });

// sneding notification using tokens to user device
// exports.sendNotification = functions.firestore
//   .document("posts/{postId}")
//   .onCreate(async (snapshot) => {
//     const post = snapshot.data();
//     const{ title, body }= post;

//     // Get the FCM tokens of all users
//     const tokensSnapshot = await admin.firestore().collection("profiles").get();
//     const tokens = tokensSnapshot.docs.map((doc) => doc.data().fcmToken);
//     console.log("tokens: ", tokens)

//     // Construct the notification payload
//     const payload = {
//       notification: {
//         title: "New Post",
//         body: `${title}: ${body}`,
//       },
//     };

//     // Send the notification to all users
//     // await admin.messaging().sendToDevice(tokens, payload);

//     try {
//       const response = await messaging.sendEach(messages);
//       console.log("Notification sent successfully:", response);
//     } catch (error) {
//       console.error("Error sending notification:", error);
//     }
//   });
