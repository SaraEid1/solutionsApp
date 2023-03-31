import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  FlatList
} from "react-native";
import {
  collection,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Timestamp } from "firebase/firestore";
import { SafeAreaProvider } from "react-native-safe-area-context";
import tw from 'tailwind-react-native-classnames';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [newComment, setNewComment] = useState("");
  const [location, setLocation] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {
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

  function addPost() {
    if (!newPostTitle || !newPostBody) return;
    addDoc(collection(db, "posts"), {
      title: newPostTitle,
      body: newPostBody,
      createdAt: Timestamp.now(),
      comments: [],
    })
      .then(() => {
        setNewPostTitle("");
        setNewPostBody("");
        setLocation("")
        setAddress("")
      })
      .catch((error) => {
        console.error("Error adding post: ", error);
      });
  }

  return (
    <SafeAreaProvider>
      <View style={tw`bg-gray-50`}>
        <View style={tw`p-4`}>
          <View style={tw`bg-white rounded-lg shadow-md p-4`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-700 mb-2`}>Title</Text>
              <TextInput
                value={newPostTitle}
                onChangeText={setNewPostTitle}
                style={tw`bg-gray-200 p-2 rounded-md text-gray-700`}
                placeholder="Title"
                placeholderTextColor="#ccc"
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
              <Text style={tw`text-lg font-bold text-gray-700 mb-2`}>Content</Text>
              <TextInput
                value={newPostBody}
                onChangeText={setNewPostBody}
                style={tw`bg-gray-200 p-2 rounded-md h-24 text-gray-700`}
                placeholder="Content"
                placeholderTextColor="#ccc"
                multiline={true}
                numberOfLines={4}
                returnKeyType="done"
                ref={(input) => {
                  this.secondTextInput = input;
                }}
              />
            </View>

            <View>
          <Text  style={tw`text-lg font-bold text-gray-700 mb-2`}> Location </Text>
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log("ADDRESS ", data.description);
              setLocation(details.geometry.location);
              setAddress(data.description)
             
            }}
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

            <Button
              style={tw`bg-blue-500 py-2 rounded-lg`}
              title="Add Post"
              onPress={addPost}
            />
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
