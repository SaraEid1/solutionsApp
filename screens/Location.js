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
import Addpost from "./Addpost";

export default function Location() {
    const [posts, setPosts] = useState([]);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostBody, setNewPostBody] = useState("");
    const [location, setLocation] = useState({})
    const [newComment, setNewComment] = useState("");
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

        const titleArray = newPostTitle.trim().split(/\s+/); // split title into words
        location["address"] = address
        addDoc(collection(db, "posts"), {
            title: newPostTitle,
            titleArray: titleArray, // add title array to Firestore
            body: newPostBody,
            location, location,
            createdAt: Timestamp.now(),
            comments: [],
        })
            .then(() => {
                setNewPostTitle("");
                setNewPostBody("");
                setLocation({});
                setAddress("")
            })
            .catch((error) => {
                console.error("Error adding post: ", error);
            });
    }

    return (
        <SafeAreaProvider>
            <View>
                <Text style={tw`text-lg font-bold text-gray-700 mb-2`}> Location </Text>
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        // console.log(data, details);
                        setLocation(details.geometry.location);
                        setAddress(details.formatted_address)
                        console.log(address)
                        // setAddress(details.)
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

                <TouchableOpacity onPress={Addpost} style={styles.postButton}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    postContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF5F1',
        borderWidth: 1,
        borderColor: '#FFCDB9',
        width: 340,
        borderRadius: 15,
        alignSelf: 'center', // centers the container horizontally
        justifyContent: 'center', // centers the container vertically
        marginTop: '20%', // moves the container down by 50% of the screen height
    },
    postButton: {
        backgroundColor: '#FF7D5C',
        borderRadius: 20,
        width: 150,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 20,
        marginTop: 20,
        alignSelf: 'flex-end', // aligns the button to the right
    },

    postButtonText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold'
    },
});