import React from 'react';
import { View, ScrollView, Image, StyleSheet, Linking } from 'react-native';
import { Text, Appbar, Button } from 'react-native-paper';

const NewsDetailScreen = ({ route, navigation }) => {
  const { title, image, description, link } = route.params;

  const openFullArticle = () => {
    if (link) {
      Linking.openURL(link);
    } else {
      alert('Full article link not available.');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Full Article" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image source={image} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>
          {description || 'No detailed content available.'}
        </Text>

        <Button
          mode="contained"
          onPress={openFullArticle}
          style={styles.button}
          icon="open-in-new"
        >
          Read Full Article
        </Button>
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
    paddingBottom: 40,
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
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
});

export default NewsDetailScreen;
