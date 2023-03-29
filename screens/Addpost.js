import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
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

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [newComment, setNewComment] = useState("");

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
      })
      .catch((error) => {
        console.error("Error adding post: ", error);
      });
  }

  return (
    <SafeAreaProvider>
      <ScrollView style={tw`bg-gray-50`}>
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

            <Button
              style={tw`bg-blue-500 py-2 rounded-lg`}
              title="Add Post"
              onPress={addPost}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
