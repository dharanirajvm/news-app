import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import NewsCard from '../components/NewsCard';

const newsData = [
  {
    id: '1',
    title: 'New Technology Breakthrough',
    description: 'Scientists announce a major breakthrough in renewable energy.',
    image: require('../assets/news_image1.jpeg'),
  },
  {
    id: '2',
    title: 'Global Economy Update',
    description: 'Market trends show signs of recovery and new growth opportunities.',
    image: require('../assets/news_image2.webp'),
  },
  {
    id: '3',
    title: 'Health and Wellness Tips',
    description: 'Experts share essential tips for a healthy lifestyle and mental well-being.',
    image: require('../assets/news_image3.webp'),
  },
  {
    id: '4',
    title: 'Space Exploration Progress',
    description: 'New mission launched to explore a distant galaxy.',
    image: require('../assets/news_image4.webp'),
  },
  {
    id: '5',
    title: 'Local Community Event',
    description: 'Annual town fair brings together thousands of residents for fun and games.',
    image: require('../assets/news_image5.jpg'),
  },
  // TODO: Add more data or integrate with a news API (e.g., NewsAPI) here
];

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="News Feed" />
      </Appbar.Header>
      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NewsCard
            image={item.image}
            title={item.title}
            description={item.description}
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
});

export default HomeScreen;