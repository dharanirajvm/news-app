import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, List } from 'react-native-paper';

const trendingData = [
  { id: '1', title: 'Tech Stocks Surge After Q2 Reports' },
  { id: '2', title: 'Climate Change Summit Kicks Off in Paris' },
  { id: '3', title: 'Sports: Local Team Wins Championship' },
  { id: '4', title: 'Celebrity News: New Movie Release Breaks Records' },
  { id: '5', title: 'Health: New Study on Sleep and Productivity' },
  // TODO: Add more data or integrate with a news API for dynamic trending content
];

const TrendingScreen = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Trending" />
      </Appbar.Header>
      <FlatList
        data={trendingData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            left={() => <List.Icon icon="chart-line" />}
            style={styles.listItem}
            titleStyle={styles.listTitle}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
  },
  listTitle: {
    fontWeight: '500',
  },
});

export default TrendingScreen;