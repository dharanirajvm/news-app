import { API_KEY } from '@env';
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, ScrollView } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import Config from 'react-native-config';

// const API_KEY = Config.API_KEY;

const CATEGORIES = ['technology', 'sports', 'business', 'health', 'science', 'entertainment', 'world'];

const HomeScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('technology');

  const fetchNews = async (category) => {
    setLoading(true);
    setError('');
    const API_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=en&country=in&category=${category}`;

    try {
      const response = await axios.get(API_URL);
      console.log(`📰 Fetching category: ${category}`);
      console.log('📰 News API Raw Response:', JSON.stringify(response.data.results, null, 2));

      if (response.data && response.data.results) {
        const uniqueNews = response.data.results.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.link === item.link)
        );

        console.log('🆔 Article Identifiers:');
        uniqueNews.forEach((article, index) => {
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

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

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

      {/* ===== Filter Bar ===== */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            mode={selectedCategory === cat ? 'contained' : 'outlined'}
            style={[
              styles.filterButton,
              selectedCategory === cat && styles.activeFilter,
            ]}
            labelStyle={{ color: selectedCategory === cat ? '#fff' : '#333' }}
            onPress={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </ScrollView>

      {/* ===== News List ===== */}
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContainer: {  paddingVertical: 8 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red' },
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
    //marginVertical: 8  
    },
  filterButton: {
    marginHorizontal: 4,
    borderColor: '#ccc',
    borderRadius: 20,
     height: 40,             
  justifyContent: 'center', 
 // marginVertical: 8  
  },
  activeFilter: {
    backgroundColor: '#391a65ff',
  },
});

export default HomeScreen;
