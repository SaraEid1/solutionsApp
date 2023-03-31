import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { GoogleAuthProvider } from '@react-native-firebase/auth';
import { getAuth, signInWithRedirect, getRedirectResult } from '@react-native-firebase/auth';
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
            setDoc(profileDocRef, {
              studentId: studentId,
            }, { merge: true })
              .then(() => {
                createUserWithEmailAndPassword(auth, email, password)
                  .then((userCredentials) => {
                    const user = userCredentials.user;
                    console.log("Registered with:", user.email);
                    setDoc(profileDocRef, {
                      email: user.email,
                    })
                  })
                console.log("Profile document created successfully");
                navigation.replace("Home");
              })
              .catch((error) => {
                console.error("Error adding profile document: ", error);
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
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
              const user = userCredentials.user;
              console.log("Registered with:", user.email);
            })
          console.log("Student ID exists in database.");
          navigation.replace("Home");
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

  

  React.useEffect(() => {
    setMessage(JSON.stringify(response));
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      console.log("Sign in success");
      navigation.navigate("Home");
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
    });
    if (userInfo) {
      console.log(userInfo.name)
    }
  }

  function showUserInfo() {
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
    <KeyboardAvoidingView
      className="flex-1 items-center justify-center bg-black"
      style={styles.container}
      behavior="padding"
    >
      <Text className="font-extrabold text-2xl text-white mb-5">
        Log In to get started!{" "}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />

        <TextInput
          placeholder="Student ID"
          value={studentId}
          onChangeText={(text) => setStudentId(text)}
          style={styles.input}
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

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}
            onPress={accessToken ? getUserData : () => { promptAsync({ showInRecents: true }) }}>Sign in with Google</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
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
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonOutline: {
    backgroundColor: "#ffffff",
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 18,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 18,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
  },
});