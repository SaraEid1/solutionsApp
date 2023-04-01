import React, { useState, useEffect } from "react";
import { SearchBar } from '@rneui/themed';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/core";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextField,
  Button,
  ScrollView,
  FlatList
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
  const navigation = useNavigation();

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

  const renderItem = ({ item: post }) => {
    return (
      <View key={post.id} style={styles.postContainer}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postBody}>{post.body}</Text>
        <Text style={styles.postDate}>
          {post.createdAt.toDate().toLocaleString()}
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
            <View key={index} style={styles.commentContainer}>
              <Text style={styles.comment}>{comment}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.inputContainer}>
          <View style={styles.searchInput}>
            <FontAwesomeIcon icon={faSearch} size={20} color="#ccc" />
            <TextInput
              style={{ flex: 1, marginLeft: 10 }}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate ("New Post")} style={styles.newPostButton}>
          <MaterialCommunityIcons
          name="plus-circle-outline"
          size={30}
          color="#ffffff"
        />
            <Text style={styles.newPostButtonText}>New Post</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.postsContainer}
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  newPostButton:{
    backgroundColor: '#FF7D5C',
    borderRadius: 20,
    width: 296,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  
  newPostButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  inputContainer: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  postsContainer: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#FFF5F1',
    borderRadius: 10,
    borderWidth:1,
  borderColor: '#FFCDB9',
    padding: 10,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postBody: {
    fontSize: 16,
    marginBottom: 10,
  },
  postDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: '#fff',
    padding: 5,
    marginBottom: 5,
    borderRadius:5,
  },
  commentsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  commentContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FF7D5C",
    marginBottom: 10,
  },
  comment: {
    fontSize: 16,
  },
});