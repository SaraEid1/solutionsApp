import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFirestore, collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

import { db } from "../firebase";
import { Timestamp } from "firebase/firestore";

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(getFirestore(), "posts"), orderBy("createdAt", "desc"), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const post = doc.data();
        // Convert createdAt to a Date object if it's a Timestamp
        if (post.createdAt instanceof Timestamp) {
          post.createdAt = post.createdAt.toDate();
        }
        return {
          id: doc.id,
          ...post,
        };
      });
      setRecentPosts(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(
      collection(getFirestore(), "posts"),
      where("titleArray", "array-contains", "emergency".toLowerCase()),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const post = doc.data();
        // Convert createdAt to a Date object if it's a Timestamp
        if (post.createdAt instanceof Timestamp) {
          post.createdAt = post.createdAt.toDate();
        }
        return {
          id: doc.id,
          ...post,
        };
      });
      setFeaturedPosts(data);
    });
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item: post }) => {
    return (
      <View key={post.id} style={styles.postContainer}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postBody}>{post.body}</Text>
        <Text style={styles.postDate}>{post.createdAt.toLocaleString()}</Text>
      </View>
    );
  };

  const renderItem1 = ({ item: post }) => {
    return (
      <View key={post.id} style={styles.postContainerfeatured}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postBody}>{post.body}</Text>
        <Text style={styles.postDate}>{post.createdAt.toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.recentlyText}>Featured Posts</Text>
      <FlatList

        showsHorizontalScrollIndicator={false}
        style={styles.postsContainerFeatured}
        data={featuredPosts}
        renderItem={renderItem1}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ justifyContent: 'flex-start' }}

      />

      <Text style={styles.recentlyText}>Recently Reported</Text>
      <FlatList

        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.postsContainer}
        data={recentPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  postsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  postsContainerFeatured: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  postContainer: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 11,
    minWidth: 100,
    maxWidth: 300,
    backgroundColor: '#FFCDB9',
    maxHeight: 140,
  },
  postContainerfeatured: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 11,
    minWidth: 300,
    maxWidth: 400,
    backgroundColor: '#FFF5F1',
    maxHeight: 140,
    marginBottom: 15,
    borderColor: '#FFCDB9',
    borderWidth: 1,
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#333"
  },
  postBody: {
    marginBottom: 5,
    color: "#666"
  },
  postDate: {
    color: "#999",
  },
  recentlyText: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 10,
    marginTop: 15,
    color: "#333"
  },
  title: {
    fontWeight: "bold",
    fontSize: 45,
    color: '#FF4010',
  }

});
