import React, { useRef, useState, useEffect } from "react";
import { SearchBar } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/core";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { Timestamp } from "firebase/firestore";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { address } = route.params || {};
  const scrollRef = useRef(null);
  const [scrollToIndex, setScrollToIndex] = useState(null);

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

      if (address) {
        const filteredPost = data.find((post) => {
          if ("location" in post) {
            return post.location.address === address;
          }
        });

        if (filteredPost) {
          const index = data.indexOf(filteredPost);
          setScrollToIndex(index);
        }
      }
    });

    return () => unsubscribe();
  }, [address]);

  const getItemLayout = (_, index) => {
    const post = filteredPosts[index];
    const bodyHeight = post.body ? post.body.split(" ").length * 4 : 0;
    return {
      length: bodyHeight,
      offset: 400 * index * 1.25,
      index,
    };
  };

  function addComment(postId) {
    if (!newComment) return;
    updateDoc(doc(db, "posts", postId), {
      comments: arrayUnion(newComment),
    })
      .then(() => {
        console.log("Comment added successfully!");
        setNewComment("");
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
      <View style={styles.header}>
        <View style={styles.searchInput}>
          <TextInput
            style={styles.searchInputText}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("New Post")}
          style={styles.newPostButton}
        >
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={24}
            color="#ffffff"
          />
          <Text style={styles.newPostButtonText}>New Post</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={scrollRef}
        style={styles.postsContainer}
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        getItemLayout={getItemLayout}
        initialScrollIndex={scrollToIndex}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,
  },
  searchInputText: {
    fontSize: 16,
    color: "#333",
  },
  newPostButton: {
    backgroundColor: "#FF7D5C",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  newPostButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  postsContainer: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: "#FFF5F1",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFCDB9",
    padding: 20,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  postBody: {
    fontSize: 18,
    marginBottom: 15,
    color: "#666",
  },
  postDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  commentsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  commentContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF7D5C",
    padding: 10,
    marginBottom: 10,
  },
  comment: {
    fontSize: 17,
    color: "#333",
    fontFamily: 'Roboto',
  },
});
