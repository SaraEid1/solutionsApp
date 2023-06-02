import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import YouTube from 'react-native-youtube-iframe';
import * as Linking from 'expo-linking';
import { SafeAreaProvider } from "react-native-safe-area-context";
import axios from 'axios';

function Search() {
  const YOUR_API_KEY = "<YOUR_API_KEY>";
  const YOUR_CSE_ID = "<YOUR_CSE_ID>";
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  const fetchResults = async () => {
    setIsLoading(true);
    let modifiedQuery = query + ' resource for women';

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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query === '' && !isSearchButtonClicked) {
      fetchResults();
    }
  }, [query, isSearchButtonClicked]);

  const handleSearchButtonPress = () => {
    setIsSearchButtonClicked(true);
    fetchResults();
  };

  const handleTitlePress = (result) => {
    if (result) {
      Linking.openURL(result.formattedUrl);
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              key: YOUR_API_KEY,
              q: 'mental health resources for women',
              type: 'video',
              part: 'snippet',
              maxResults: 4,
            },
          }
        );

        if (response.status === 200) {
          setVideos(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={query}
            onChangeText={(text) => setQuery(text)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchButtonPress}
          >
            <MaterialCommunityIcons
              name="book-search-outline"
              size={24}
              color="#ffffff"
            />
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {query === '' && results && (
          <View style={styles.resultsContainer}>
            {results.map((result) => (
              <View key={result.cacheId} style={styles.result}>
                <Text style={styles.link}>{result.displayLink}</Text>
                <TouchableOpacity onPress={() => handleTitlePress(result)}>
                  <Text style={styles.title}>{result.title}</Text>
                </TouchableOpacity>
                <Text style={styles.snippet}>{result.snippet}</Text>
              </View>
            ))}
          </View>
        )}

        {!isLoading && query !== '' && results && (
          <View style={styles.resultsContainer}>
            {results.map((result) => (
              <View key={result.cacheId} style={styles.result}>
                <Text style={styles.link}>{result.displayLink}</Text>
                <TouchableOpacity onPress={() => handleTitlePress(result)}>
                  <Text style={styles.title}>{result.title}</Text>
                </TouchableOpacity>
                <Text style={styles.snippet}>{result.snippet}</Text>
              </View>
            ))}
          </View>
        )}

        {isLoading && <Text style={styles.loading}>Loading...</Text>}

        <View style={styles.videoContainer}>
          <Text style={styles.videoTitle}>YouTube Videos</Text>
          {videos.map((video) => (
            <View key={video.id.videoId} style={styles.video}>
              <Text style={styles.videoTitle}>{video.snippet.title}</Text>
              <YouTube videoId={video.id.videoId} height={200} />
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
    backgroundColor: '#fff',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchButton: {
    backgroundColor: '#FF7D5C',
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  resultsContainer: {
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
  loading: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  videoContainer: {
    marginTop: 20,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  video: {
    marginBottom: 20,
  },
});

export default Search;
