import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Title, Paragraph, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const NewsCard = ({ image, title, description, link }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handlePress = () => {
    navigation.navigate('NewsDetail', { title, image, description,link });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Cover source={image} style={styles.cardImage} />
        <Card.Content>
          <Title style={styles.cardTitle}>{title}</Title>
          <Paragraph style={styles.cardDescription} numberOfLines={3}>
            {description}
          </Paragraph>

          <View style={styles.actions}>
            <IconButton
              icon={liked ? 'thumb-up' : 'thumb-up-outline'}
              iconColor={liked ? '#4CAF50' : '#777'}
              size={22}
              onPress={() => {
                setLiked(!liked);
                if (disliked) setDisliked(false);
              }}
            />
            <IconButton
              icon={disliked ? 'thumb-down' : 'thumb-down-outline'}
              iconColor={disliked ? '#E53935' : '#777'}
              size={22}
              onPress={() => {
                setDisliked(!disliked);
                if (liked) setLiked(false);
              }}
            />
            <IconButton
              icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
              iconColor={bookmarked ? '#FFD54F' : '#777'}
              size={22}
              onPress={() => setBookmarked(!bookmarked)}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 200,
  },
  cardTitle: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
});

export default NewsCard;
