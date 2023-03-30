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
import Markers from "../components/DisplayPostLocation";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [newComment, setNewComment] = useState("");
  const [location, setLocation] = useState({});

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

  return (
    <SafeAreaProvider>
      {/* <ScrollView> */}
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.postTitle}> Title </Text>
          <TextInput
            value={newPostTitle}
            onChangeText={setNewPostTitle}
            style={styles.input}
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

          <Text style={styles.postTitle}> Content </Text>


          <TextInput
            value={newPostBody}
            onChangeText={setNewPostBody}
            style={[styles.input, styles.multilineInput]}
            placeholder="Content"
            placeholderTextColor="#ccc"
            multiline={true}
            numberOfLines={4}
            returnKeyType="done"
            backgroundColor="#f9f9f9"
            ref={(input) => {
              this.secondTextInput = input;
            }}
          />


        </View>

        <View>
          <Text style={styles.postTitle}> Location </Text>
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
              setLocation(details.geometry.location);
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
          style={styles.button}
          title="Add Post"
          onPress={addPost}
        ></Button>
        <ScrollView>
          <View style={styles.postsContainer}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postContainer}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postBody}>{post.body}</Text>
                <Text style={styles.postDate}>

                </Text>

                <TextInput
                  style={styles.commentInput}
                  placeholder="Add comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  onSubmitEditing={() => addComment(post.id)}
                />
                <View style={styles.commentsContainer}>
                  {post.comments.map((comment, index) => (
                    <Text key={index} style={styles.comment}>
                      {comment}
                    </Text>
                  ))}
                </View>
              </View>

            ))}


          </View>
          
        </ScrollView>

      </View>
      {/* </ScrollView> */}
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

});
