import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  function addPost() {
    if (newPostTitle && newPostBody) {
      addDoc(collection(db, "posts"), {
        title: newPostTitle,
        body: newPostBody,
        comments: [],
      })
        .then(() => {
          console.log("Post added successfully!");
          setNewPostTitle("");
          setNewPostBody("");
        })
        .catch((error) => {
          console.error("Error adding post: ", error);
        });
    }
  }

  function addComment(postId, commentText) {
    updateDoc(doc(db, "posts", postId), {
      comments: arrayUnion(commentText),
    })
      .then(() => {
        console.log("Comment added successfully!");
      })
      .catch((error) => {
        console.error("Error adding comment: ", error);
      });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
        <TextInput
          style={{ flex: 1, color: "white" }}
          value={newPostTitle}
          onChangeText={setNewPostTitle}
          placeholder="Title*"
          placeholderTextColor="grey"
        />
        <TextInput
          style={{ flex: 1, color: "white" }}
          value={newPostBody}
          onChangeText={setNewPostBody}
          placeholder="Body*"
          placeholderTextColor="grey"
        />
        <TouchableOpacity onPress={addPost}>
          <Icon name="add" type="material" color="white" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        {posts.map((post) => (
          <View
            key={post.id}
            style={{
              backgroundColor: "grey",
              padding: 10,
              marginVertical: 5,
            }}
          >
            <Text style={{ color: "white" }}>{post.title}</Text>
            <Text style={{ color: "white" }}>{post.body}</Text>
            <TextInput
              style={{
                flex: 1,
                color: "white",
                backgroundColor: "black",
                marginTop: 5,
                borderRadius: 5,
                padding: 5,
              }}
              placeholder="Add comment..."
              placeholderTextColor="grey"
              onSubmitEditing={(event) =>
                addComment(post.id, event.nativeEvent.text)
              }
            />
            <View style={{ marginTop: 5 }}>
              {post.comments &&
                post.comments.map((comment, commentIndex) => (
                  <Text key={commentIndex} style={{ color: "white" }}>
                    {comment}
                  </Text>
                ))}
            </View>
          </View>
        ))}
      </View>

    </View>
  );
}