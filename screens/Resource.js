import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import YouTube from 'react-native-youtube-iframe';
import * as Linking from 'expo-linking';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';
import * as Location from 'expo-location';
import { reverseGeocodeAsync } from 'expo-location';

function Search() {
    const YOUR_API_KEY = "AIzaSyAMupgR8rLSPwc1vIGpqT7kTRMQkOzDv74"
    const YOUR_CSE_ID = "f5ba8984e6c9e4ca3"
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selfDefenseVideos, setSelfDefenseVideos] = useState([]);
  const [mentalHealthVideos, setMentalHealthVideos] = useState([]);
  const [showVideos, setShowVideos] = useState(false);
  const [showSearchEngine, setShowSearchEngine] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userCity, setUserCity] = useState('');

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to show resources near your location.');
          return;
        }
        const location = await Location.getCurrentPositionAsync();
        setUserLocation(location.coords);

        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          setUserCity(reverseGeocode[0].city);
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    getUserLocation();
  }, []);

  const fetchResults = async () => {
    setIsLoading(true);
    let modifiedQuery = query + 'campus resources for women';

    if (userCity) {
      modifiedQuery += ` in ${userCity}`;
      console.log (userCity)
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${YOUR_API_KEY}&cx=${YOUR_CSE_ID}&q=${encodeURIComponent(modifiedQuery)}&num=6`
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
        const selfDefenseResponse = await axios.get(
            'https://www.googleapis.com/youtube/v3/search?key=AIzaSyBcFCgjPFRhOHsQEMYaphuylaY45KyUKWc',
          {
            params: {
              q: 'campus safety strategies for women',
              type: 'video',
              part: 'snippet',
              maxResults: 3,
            },
          }
        );

        if (selfDefenseResponse.status === 200) {
          setSelfDefenseVideos(selfDefenseResponse.data.items);
        }

        const mentalHealthResponse = await axios.get(
            'https://www.googleapis.com/youtube/v3/search?key=AIzaSyBcFCgjPFRhOHsQEMYaphuylaY45KyUKWc',
          {
            params: {
              q: 'mental health resources for women in college',
              type: 'video',
              part: 'snippet',
              maxResults: 3,
            },
          }
        );

        if (mentalHealthResponse.status === 200) {
          setMentalHealthVideos(mentalHealthResponse.data.items);
        }
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const handleVideosButtonPress = () => {
    setShowVideos(true);
    setShowSearchEngine(false);
  };

  const handleSearchEngineButtonPress = () => {
    setShowVideos(false);
    setShowSearchEngine(true);
  };

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, showVideos ? styles.activeButton : null]}
            onPress={handleVideosButtonPress}
          >
            <Text style={styles.buttonText}>Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, showSearchEngine ? styles.activeButton : null]}
            onPress={handleSearchEngineButtonPress}
          >
            <Text style={styles.buttonText}>Search Engine</Text>
          </TouchableOpacity>
        </View>

        {showVideos && (
          <View style={styles.videoContainer}>
            <Text style={styles.videoTitle}></Text>
            {selfDefenseVideos.map((video) => (
              <View key={video.id.videoId} style={styles.video}>
                <Text style={styles.videoTitle}>{video.snippet.title}</Text>
                <YouTube videoId={video.id.videoId} height={150} />
              </View>
            ))}
            <Text style={styles.videoTitle}></Text>
            {mentalHealthVideos.map((video) => (
              <View key={video.id.videoId} style={styles.video}>
                <Text style={styles.videoTitle}>{video.snippet.title}</Text>
                <YouTube videoId={video.id.videoId} height={150} />
              </View>
            ))}
          </View>
        )}

        {showSearchEngine && (
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
          </View>
        )}
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
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#FFCDB9',
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activeButton: {
    backgroundColor: '#FF7D5C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoContainer: {
    marginTop: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF7D5C',
  },
  searchContainer: {
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,
  },
  searchButton: {
    backgroundColor: '#FF7D5C',
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  video: {
    marginBottom: 20,
  },
  activeButton: {
    backgroundColor: '#FF7D5C',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default Search;