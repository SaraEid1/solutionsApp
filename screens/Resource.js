import React, { useState } from 'react';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import YouTubeIframe from 'react-native-youtube-iframe';

function Search() {
    const YOUR_API_KEY = "AIzaSyAMupgR8rLSPwc1vIGpqT7kTRMQkOzDv74"
    const YOUR_CSE_ID = "f5ba8984e6c9e4ca3"

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [videoIds, setVideoIds] = useState([]);

    const fetchResults = async () => {
        setIsLoading(true);
        let modifiedQuery = query + 'mental health and self defense resources for women'

        try {
            const response = await fetch(
                `https://www.googleapis.com/customsearch/v1?key=${YOUR_API_KEY}&cx=${YOUR_CSE_ID}&q=${modifiedQuery}&num=6`
            );
            if (response.ok) {
                const data = await response.json();
                setResults(data.items);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (query === '' && !isSearchButtonClicked) {
            fetchResults();
        }
    }, [query, isSearchButtonClicked])

    const handleSearchButtonPress = () => {
        setIsSearchButtonClicked(true);
        fetchResults();
    };

/*
    const fetchVideos = async () => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=id&maxResults=2&q=self+defense|mental+health+for+women&type=video&videoDefinition=high&key=AIzaSyCmQSRBrYAfz4wNkQ-hQ6tWlMyxGtIAi9c`
            );
            if (response.ok) {
                const data = await response.json();
                const ids = data.items.map(item => item.id.videoId);
                setVideoIds(ids);
            }
        } catch (error) {
            console.error(error);
        }
    };

    fetchVideos();
*/
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.videoContainer}>
                    {videoIds.map(id => (
                        <View key={id}>
                            <YouTubeIframe
                                apiKey='AIzaSyCmQSRBrYAfz4wNkQ-hQ6tWlMyxGtIAi9c'
                                videoId={id}
                                width={320}
                                height={180}
                            />
                        </View>
                    ))}
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.searchInput}>
                        <FontAwesomeIcon icon={faSearch} size={20} color="#ccc" />
                        <TextInput
                            style={{ flex: 1, marginLeft: 10 }}
                            placeholder="Search"
                            value={query}
                            onChangeText={(text) => setQuery(text)}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.searchButton} onPress={handleSearchButtonPress}>
                    <MaterialCommunityIcons
                        name="book-search-outline"
                        size={30}
                        color="#ffffff"
                    />
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>


                {
                    query === "" && results && (
                        <View style={styles.results}>
                            {results.map((result) => (
                                <View key={result.cacheId} style={styles.result}>
                                    <Text style={styles.link}>{result.displayLink}</Text>
                                    <Text style={styles.title}>{result.title}</Text>
                                    <Text style={styles.snippet}>{result.snippet}</Text>
                                </View>
                            ))}
                        </View>
                    )
                }
                {
                    !isLoading && query !== "" && results && (
                        <View style={styles.results}>
                            {results.map((result) => (
                                <View key={result.cacheId} style={styles.result}>
                                    <Text style={styles.link}>{result.displayLink}</Text>
                                    <Text style={styles.title}>{result.title}</Text>
                                    <Text style={styles.snippet}>{result.snippet}</Text>
                                </View>
                            ))}
                        </View>
                    )
                }
                {isLoading && <Text style={styles.loading}>Loading...</Text>}
            </View >


        </ScrollView >

    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },

    results: {
        marginTop: 10,
    },
    result: {
        marginBottom: 10,
    },
    link: {
        fontSize: 14,
        color: '#006621',
        marginBottom: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    snippet: {
        fontSize: 14,
        color: '#545454',
    },
    searchButton: {
        backgroundColor: '#FF7D5C',
        borderRadius: 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 20,
        marginTop: 10,

    },

    searchButtonText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
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
        flex: 1,
    },
});

export default Search;
