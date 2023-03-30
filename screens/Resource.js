import React, { useState } from 'react';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';

function Search() {
    const YOUR_API_KEY = "AIzaSyAMupgR8rLSPwc1vIGpqT7kTRMQkOzDv74"
    const YOUR_CSE_ID = "f5ba8984e6c9e4ca3"



    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchResults = async () => {
        setIsLoading(true);
        let modifiedQuery = query + 'safety%20resources%20for%20women%20OR%20disadvantaged%20minorities%20AND%20(inurl:video%20OR%20inurl:article)'

        try {
            const response = await fetch(
                `https://www.googleapis.com/customsearch/v1?key=${YOUR_API_KEY}&cx=${YOUR_CSE_ID}&q=${modifiedQuery}&num=6`
            );
            if (response.ok) {
                const data = await response.json();
                console.log("DATA", data)
                setResults(data.items);
                console.log("RESUKTS, ", results)
            }

            // setIsLoading(false);
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

    return (
        <ScrollView>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    value={query}
                    onChangeText={(text) => setQuery(text)}
                />
                <Button title="Search" onPress={handleSearchButtonPress} />

                {query === "" && results && (
                    <View style={styles.results}>
                        {results.map((result) => (
                            <View key={result.cacheId} style={styles.result}>
                                <Text style={styles.link}>{result.displayLink}</Text>
                                <Text style={styles.title}>{result.title}</Text>
                                <Text style={styles.snippet}>{result.snippet}</Text>
                            </View>
                        ))}
                    </View>
                )}
                {!isLoading && query !== "" && results && (
                    <View style={styles.results}>
                        {results.map((result) => (
                            <View key={result.cacheId} style={styles.result}>
                                <Text style={styles.link}>{result.displayLink}</Text>
                                <Text style={styles.title}>{result.title}</Text>
                                <Text style={styles.snippet}>{result.snippet}</Text>
                            </View>
                        ))}
                    </View>
                )}
                {isLoading && <Text>Loading...</Text>}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 10,
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
});

export default Search;
