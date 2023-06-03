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
    const words = ["emergency", "Emergency", "EMERGENCY"];

    const q = query(
      collection(getFirestore(), "posts"),
      where("titleArray", "array-contains-any", words),
      orderBy("createdAt", "desc"),
      limit(2)
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
    <Text style={styles.featuredText}>Featured Posts</Text>
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.postsContainerFeatured}
      data={featuredPosts}
      renderItem={renderItem1}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 20 }}
    />

    <Text style={styles.recentlyText}>Recently Reported</Text>
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.postsContainer}
      data={recentPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 20 }}
    />
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  postsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    maxHeight: 200,
  },
  postsContainerFeatured: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  postContainer: {
    padding: 15,
    marginRight: 10,
    borderRadius: 16,
    width: 210,
    backgroundColor: '#FFCDB9',
    maxHeight: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  postContainerfeatured: {
    padding: 15,
    marginRight: 10,
    borderRadius: 16,
    width: 350,
    backgroundColor: '#FFF5F1',
    marginBottom: 15,
    borderColor: '#FFCDB9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  postTitle: {
    fontFamily: 'Roboto',
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    color: "#333"
  },
  postBody: {
    fontFamily: 'Roboto',
    marginBottom: 5,
    color: "#666"
  },
  postDate: {
    fontFamily: 'Roboto',
    color: "#0000",
    fontSize: 12,
  },
  featuredText: {
    fontFamily: 'Roboto',
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 10,
    marginLeft: 12,
    color: "#333"
  },
  recentlyText: {
    fontFamily: 'Roboto',
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 10,
    marginLeft: 12,
    color: "#333"
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: "bold",
    fontSize: 45,
    color: '#FF4010',
    marginBottom: 20,
    marginLeft: 10,
  }
});