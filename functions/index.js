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

    // Get the email addresses of all users
    const usersSnapshot = await db.collection("profiles").get();
    const emails = usersSnapshot.docs.map((doc) => doc.data().email);

    const lowercaseBody = body.toLowerCase().replace(/\W/g, "");
    const lowercaseTitle = title.toLowerCase().replace(/\W/g, "");

    const keywords = ["emergency", "urgent"];
    const keywordExists = keywords.some((keyword) => {
      // Check if any of the keywords exist in the post
      const lowercaseKeyword = keyword.toLowerCase().replace(/\W/g, "");
      return lowercaseBody.includes(lowercaseKeyword) || lowercaseTitle.includes(lowercaseKeyword);
    });

    if (keywordExists) {
      let mailOptions = {
        from: "EmpowerHer Notification",
        to: "", // Leave this field empty to include recipients in BCC
        bcc: emails.join(","),
        subject: `New post - ${title}`,
        text: `${body}`,
      };

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
