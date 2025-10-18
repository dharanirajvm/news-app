import { API_KEY } from '@env';
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, ScrollView, Alert } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import axios from 'axios';
import * as Location from 'expo-location';
import NewsCard from '../components/NewsCard';

const HomeScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [district, setDistrict] = useState(''); // district for AppBar
  const [cityQuery, setCityQuery] = useState(''); // search query for API

  // Get user location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch local news.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get district
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverseGeocode && reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        const districtName = place.subregion || place.city || place.region || 'Your Area';
        setDistrict(districtName);
        setCityQuery(districtName); // use district as search query
      }
    } catch (err) {
      console.error('Location error', err);
    }
  };

  const fetchNews = async () => {
    if (!cityQuery) return; // Wait until district is available

    setLoading(true);
    setError('');

    const API_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&q=${encodeURIComponent(cityQuery)}`;

    try {
      const response = await axios.get(API_URL);

      if (response.data && response.data.results) {
        const uniqueNews = response.data.results.filter(
          (item, index, self) => index === self.findIndex((t) => t.link === item.link)
        );
        setNews(uniqueNews);
      } else {
        setError('No news data available for your district.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch news.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch location once
  useEffect(() => {
    getLocation();
  }, []);

  // Fetch news whenever district/cityQuery changes
  useEffect(() => {
    if (cityQuery) fetchNews();
  }, [cityQuery]);

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
      <Appbar.Content title="Trending News" subtitle={district} />
    </Appbar.Header>

    {/* Show current location */}
    <View style={styles.locationContainer}>
      <Text style={styles.locationText}>
        Showing news for: {district || 'Your Area'}
      </Text>
    </View>

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
  listContainer: { paddingVertical: 8 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  filterButton: {
    marginHorizontal: 4,
    borderColor: '#ccc',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: '#391a65ff',
  },
  locationContainer: {
  padding: 10,
  backgroundColor: '#e0e0e0',
  alignItems: 'center',
},
locationText: {
  fontSize: 14,
  color: '#333',
  fontStyle: 'italic',
},

});

export default HomeScreen;
