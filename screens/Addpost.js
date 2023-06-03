import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db, sendNotification } from "../firebase";
import { Timestamp } from "firebase/firestore";
import { SafeAreaProvider } from "react-native-safe-area-context";
import tw from 'tailwind-react-native-classnames';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAvoidingView } from 'react-native';
import {bundleResourceIO} from "@tensorflow/tfjs-react-native";

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { fetch } from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';
const { Tokenizr } = require("tokenizr");

const nlp = require("spacy-js");

export default function Addpost() {


  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [location, setLocation] = useState({});
  const [newComment, setNewComment] = useState("");
  const [address, setAddress] = useState("");
  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    // console.log("printing firebase function obj?");

    // console.log(functions);
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const post = doc.data();
        if (!(post.createdAt instanceof Timestamp)) {
          post.createdAt = Timestamp.fromDate(new Date(post.createdAt));
        }
        return {
          id: doc.id,
          ...post,
        };
      });
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  async function sendNotificationIfKeywordExists(post) {
    // const sendNotification = functions.httpsCallable("sendNotification");

    const keywords = ["emergency", "urgent"];
    const keywordExists = keywords.some((keyword) => {
      // Check if any of the keywords exist in the post
      return post.body.includes(keyword);
    });

    if (keywordExists) {
      try {
        const result = await sendNotification({ post });
        console.log("Notification sent successfully:", result);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  }

  function addPost() {
    if (!newPostTitle || !newPostBody) return;

    const titleArray = newPostTitle.trim().split(/\s+/); // split title into words
    location["address"] = address;
    addDoc(collection(db, "posts"), {
      title: newPostTitle,
      titleArray: titleArray, // add title array to Firestore
      body: newPostBody,
      location,
      location,
      createdAt: Timestamp.now(),
      comments: [],
    })
      .then(() => {
        setNewPostTitle("");
        setNewPostBody("");
        setLocation({});
        setAddress("");

        sendNotificationIfKeywordExists({
          title: newPostTitle,
          body: newPostBody,
        });
      })
      .catch((error) => {
        console.error("Error adding post: ", error);
      });
  }

  const modelJSON = require("../emergency_model_tfjs/model.json");
  const modelWeights = require("../emergency_model_tfjs/group1-shard1of1.bin");
  /*
  useEffect(() => {

      const loadModel = async () => {
        const model = await tf
          .loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
          .catch(e => console.log(e));
        console.log("Model loaded!");
       // return model;
      

      
  
       const texts = [
        "Help! There's an urgent situation on campus!",
        "I need immediate assistance! Please respond quickly!",
        "I'm in trouble and need help as soon as possible.",
        "This is urgent! We require immediate support!",
        "I need support",
        "my professor is sexist",
        "I feel really bad after what happened yesterday"
      ];

      
      
      const paddedSequences = padSequences(sequences, maxlen);
     // const paddedSequences = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 22, 9, 78];
      console.log(paddedSequences);
        const predictions = model.predict(paddedSequences);
        console.log(predictions);

        const results = [];
  
        predictions.array().then((array) => {
          texts.forEach((text, index) => {
            const prediction = array[index][0];
            results.push({ text, prediction });
          });
  
          console.log(results);
        });
  
        model.dispose();

    };
  
    loadModel();
  }, []);
  
*/

  return (
    <SafeAreaProvider>
      <ScrollView style={tw`bg-gray-50`} scrollEnabled={!showLocation}>
        {!showLocation && (
          <View style={styles.container}>
            <View style={styles.postContainer}>
              <View>
                <View>
                  <Text style={tw`text-lg font-bold text-gray-700 mb-2`}>
                    Title
                  </Text>
                  <TextInput
                    value={newPostTitle}
                    onChangeText={setNewPostTitle}
                    style={tw`bg-white p-2 rounded-md text-gray-700`}
                    placeholder="Title"
                    placeholderTextColor="#FFCDB9"
                    autoFocus={true}
                    autoCapitalize="sentences"
                    autoCompleteType="off"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.secondTextInput.focus();
                    }}
                  />
                </View>

                <View style={tw`mb-4`}>
                  <Text
                    style={tw`text-lg font-bold text-gray-700 mb-2`}
                    marginTop={10}
                  >
                    Content
                  </Text>
                  <TextInput
                    value={newPostBody}
                    onChangeText={setNewPostBody}
                    style={tw`bg-white p-2 rounded-md text-gray-700`}
                    placeholder="Type your new post..."
                    placeholderTextColor="#FFCDB9"
                    multiline={true}
                    numberOfLines={4}
                    returnKeyType="done"
                    ref={(input) => {
                      this.secondTextInput = input;
                    }}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowLocation(true);
              }}
              style={[
                styles.postButton,
                showLocation ? styles.postButton1 : null,
              ]}
            >
              <Text style={styles.postButtonText}>
                {showLocation ? "Post" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {showLocation && (
        <View style={styles.container}>
          <View style={styles.postContainer1}>
            <Text style={tw`text-lg font-bold text-gray-700 mb-2`}>
              {" "}
              Location{" "}
            </Text>
            <GooglePlacesAutocomplete
              placeholder="Search"
              onPress={(data, details = null) => {
                setLocation(details.geometry.location);
                setAddress(details.formatted_address);
                console.log(address);
              }}
              placeholderTextColor="#FFCDB9"
              fetchDetails={true}
              query={{
                key: "AIzaSyD627hKqMDBrAMpyD2w204wfx0opjrKiUI",
                language: "en",
              }}
              styles={{
                container: {
                  flex: 0,
                },
                textInputContainer: {
                  width: "100%",
                },
                textInput: {
                  height: 40,
                  color: "#5d5d5d",
                  fontSize: 16,
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  marginBottom: 10,
                  borderWidth: 0.5,
                  borderColor: "#ddd",
                },
                listView: {
                  backgroundColor: "#fff",
                  borderWidth: 0.5,
                  borderColor: "#ddd",
                  marginHorizontal: 20,
                  elevation: 1,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 15,
                  marginTop: 10,
                },
                description: {
                  fontSize: 16,
                },
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowLocation(false);
              }}
              style={styles.postButton2}
            >
              <Text style={styles.postButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                addPost();
                setShowLocation(false);
              }}
              style={styles.postButton1}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFF",
  },
  postContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF5F1",
    borderWidth: 1,
    borderColor: "#FFCDB9",
    width: 340,
    borderRadius: 15,
    alignSelf: "center", // centers the container horizontally
    justifyContent: "center", // centers the container vertically
    marginTop: "20%", // moves the container down by 50% of the screen height
  },
  postContainer1: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF5F1",
    borderWidth: 1,
    borderColor: "#FFCDB9",
    width: 340,
    borderRadius: 15,
    alignSelf: "center",
    justifyContent: "center",
    bottom: 0,
    marginBottom: 140,
    position: "absolute",
    height: 240,
  },
  postButton: {
    backgroundColor: "#FF7D5C",
    borderRadius: 20,
    width: 150,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
    alignSelf: "flex-end", // aligns the button to the right
  },

  postButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },

  postButton1: {
    backgroundColor: "#FF7D5C",
    borderRadius: 20,
    width: 150,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 70,
    alignSelf: "flex-end", // aligns the button to the right
    marginLeft: 25,
  },
  postButton2: {
    backgroundColor: "#FF7D5C",
    borderRadius: 20,
    width: 150,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 70,
    alignSelf: "flex-start", // aligns the button to the right
    marginRight: 25,
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
