import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { doc, setDoc, getDoc, collection , getDocs, query, where} from "firebase/firestore";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const logo = require('../assets/google.png');
import { db } from "../firebase";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");

  const navigation = useNavigation();

  const handleSignUp = () => {
    const encodedStudentId = encodeURIComponent(studentId);
  
    if (studentId) {
      const profileDocRef = doc(db, "profiles", encodedStudentId);
      getDoc(profileDocRef)
        .then((doc) => {
          if (doc.exists()) {
            console.log("Student ID already exists in database.");
            alert("Student ID is found. Please sign in.");
          } else {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredentials) => {
                const user = userCredentials.user;
                console.log("Registered with:", user.email);
                setDoc(profileDocRef, {
                  studentId: studentId,
                  email: user.email,
                }, { merge: true })
                console.log("Profile document created successfully");
                navigation.replace("Home");
              })
              .catch((error) => {
                console.error("Error creating user: ", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error getting profile document: ", error);
        });
    }
  };
  

  const handleLogin = () => {
    const encodedStudentId = encodeURIComponent(studentId);
    const profileDocRef = doc(db, "profiles", encodedStudentId);
    getDoc(profileDocRef)
      .then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.email === email) {
            signInWithEmailAndPassword(auth, email, password)
              .then((userCredentials) => {
                const user = userCredentials.user;
                console.log("Signed in with:", user.email);
                console.log("Student ID exists in database.");
                navigation.replace("Home");
              })
              .catch((error) => {
                console.error("Error signing in: ", error);
              });
          } else {
            console.log("Email does not match.");
            alert("Incorrect email for this student Id. Please try again.");
          }
        } else {
          console.log("Student ID does not exist in database.");
          alert("Student ID not found. Please sign up.");
        }
      })
      .catch((error) => {
        console.error("Error getting profile document: ", error);
      });
  };
  


  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [message, setMessage] = React.useState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "140130769187-c96husl24318t9fgvj6j3mccl4103gpq.apps.googleusercontent.com",
    expoClientId: "140130769187-hkisfb0tqfu3mpohjfq5cjn8dma3kr6v.apps.googleusercontent.com",
  })



  const handleSignIn = async (email) => {
    console.log("email", email)
    const profileDocRef = collection(db, "profiles");
    const querySnapshot = await getDocs(query(profileDocRef, where("email", "==", email)));
    console.log(querySnapshot.size)
    console.log("email", data.email)
    if (querySnapshot.size === 1) {
      // User is already associated with a student ID, so sign them in and navigate to the home screen
      const doc = querySnapshot.docs[0];
      const studentId = doc.data().studentId;
      await signInWithEmailAndPassword(auth, email, "password");
      console.log(studentId)
      console.log("true if statment")
      // navigation.navigate("Home");
    } else {
      // User is not associated with a student ID, so prompt them to enter one
      const studentId = window.prompt("Please enter your student ID:");
      if (studentId) {
        // Store the student ID in the Firestore database
        await addDoc(profileDocRef, {
          email,
          studentId
        });
        await signInWithEmailAndPassword(auth, email, "password");
        // navigation.navigate("Home");
      }
    }
  };


  React.useEffect(() => {
    setMessage(JSON.stringify(response));
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      console.log("Sign in success");
      getUserData()
      navigation.navigate("Home");
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
      navigation.replace("Home");
     // console.log ("data" , data);



    });
  }

/*
  React.useEffect(() => {
    console.log("data", userInfo);
  }, [userInfo]);
  
*/

  function showUserInfo(userInfo) {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  }


  return (
    <View
      className="flex-1 items-center justify-center bg-black"
      style={styles.container}
      behavior="padding"
    >
      <Text style={styles.welcome}>
      EmpowerHer
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.titles}>Email Address</Text>
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <Text style={styles.titles}>Student Number</Text>

        <TextInput
          placeholder="123456789"
          value={studentId}
          onChangeText={(text) => setStudentId(text)}
          style={styles.input}
        />

        <Text style={styles.titles}>Password</Text>
        <TextInput
          placeholder="•••••••••••"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={accessToken ? getUserData : () => { promptAsync({ showInRecents: true }) }}
          style={[styles.button, styles.buttonOutline]}
        >
          <Image source={logo} style={styles.image} />
          <Text style={styles.buttonOutlineText}> Sign in with Google</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {

    borderWidth: 2,
    borderColor: '#C4C4C4',
    borderRadius: 20,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 23,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: '#FF7D5C',
  },
  titles:{
    fontWeight: 500,
    fontSize: 18,
    lineHeight: 18,
    marginTop:24,
    color: '#1C1C1C',
  },
  buttonOutline: {
    backgroundColor: "#ffffff",
    borderColor: "#FF7D5C",
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 18,
  },
  buttonOutlineText: {
    color: "#1C1C1C",
    fontWeight: "700",
    fontSize: 18,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  image: {
    width: 20, // set the width and height of the image according to your requirement
    height: 20,
    marginRight: 10, // add this to create some space between the image and text
  },

  welcome:{
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 30,
    color:"#FF4010",
  }
});