import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextField,
  Button,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { Timestamp } from "firebase/firestore";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import tw from "tailwind-react-native-classnames";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [newComment, setNewComment] = useState("");
  const [location, setLocation] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const post = doc.data();
        // Convert createdAt to a Firestore timestamp if it's not already
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
    console.log("Title: ", newPostTitle);
    console.log("Body: ", newPostBody);
    if (!newPostTitle || !newPostBody || !location) return;
    console.log("button pressed")
    addDoc(collection(db, "posts"), {
      title: newPostTitle,
      body: newPostBody,
      createdAt: Timestamp.now(),
      location: location,
      comments: [],
    })
      .then(() => {
        console.log("Post added successfully!");
        setLocation({})
        setNewPostTitle("");
        setNewPostBody("");
        console.log("location: ", location)
       
        
      })
      .catch((error) => {
        console.error("Error adding post: ", error);
      });
  }

  function addComment(postId) {
    if (!newComment) return;
    updateDoc(doc(db, "posts", postId), {
      comments: arrayUnion(newComment),
    })
      .then(() => {
        console.log("Comment added successfully!");
        setNewComment("");
        // setLocation("")
      })
      .catch((error) => {
        console.error("Error adding comment: ", error);
      });
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <ScrollView style={tw`p-4 bg-white`}>
        <View style={tw`flex-1`}>
          <TextInput
            style={tw`p-2 bg-white border border-gray-400 rounded mb-4`}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {filteredPosts.map((post) => (
            <View key={post.id} style={tw`bg-gray-100 p-4 rounded mb-4`}>
              <Text style={tw`text-lg font-bold mb-2`}>{post.title}</Text>
              <Text style={tw`text-base mb-4`}>{post.body}</Text>
              <Text style={tw`text-gray-500 mb-2`}>{post.createdAt.toDate().toLocaleString()}</Text>

              <TextInput
                style={tw`p-2 bg-white border border-gray-400 rounded mb-2`}
                placeholder="Add comment..."
                value={newComment}
                onChangeText={setNewComment}
                onSubmitEditing={() => addComment(post.id)}
              />
              <View style={tw`bg-gray-200 p-2 rounded`}>
                {post.comments.map((comment, index) => (
                  <Text key={index} style={tw`text-base text-gray-500 mb-2`}>
                    {comment}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
  
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    width: "100%",
  },
  postsContainer: {
    flex: 1,

  },
  postContainer: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    marginBottom: 10,

  },

  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postBody: {
    fontSize: 16,
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: "#fff",
    padding: 5,
    marginBottom: 5,
  },
  commentsContainer: {
    backgroundColor: "#f9f9f9",
    padding: 5,
  },
  comment: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  }

});
