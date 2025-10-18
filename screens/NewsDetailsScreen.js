import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Text, Appbar } from 'react-native-paper';

const NewsDetailScreen = ({ route, navigation }) => {
  const { title, image, content } = route.params;

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Full Article" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image source={image} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content || 'No detailed content available.'}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});

export default NewsDetailScreen;
