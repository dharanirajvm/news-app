import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';
import { Appbar, Card } from 'react-native-paper';
import axios from 'axios';
import NewsCard from '../components/NewsCard';

const API_KEY = 'pub_6932c535f5f5476694ff9a2cda21967b'; // <-- Replace with your NewsData.io API key
const API_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&country=in&category=technology`;

const HomeScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
       try {
        const response = await axios.get(API_URL);

        console.log('📰 News API Raw Response:', JSON.stringify(response.data.results, null, 2));
        

        if (response.data && response.data.results) {
          const uniqueNews = response.data.results.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.link === item.link)
      )       ;
            console.log('🆔 Article Identifiers:');
            response.data.results.forEach((article, index) => {
             console.log(`${index + 1}. ${article.article_id}`);
  });
          setNews(uniqueNews);
} else {
  setError('No news data available.');
}
      } catch (err) {
        console.error(err);
        setError('Failed to fetch news.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Live News Feed" />
      </Appbar.Header>

      <FlatList
        data={news}
        keyExtractor={(item, index) => item.link || index.toString()}
        renderItem={({ item }) => (
          <NewsCard
            image={
              item.image_url
                ? { uri: item.image_url }
                : require('../assets/news_image5.jpg')
            }
            title={item.title}
            description={item.description || 'No description available.'}
            link={item.link}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingVertical: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default HomeScreen;
