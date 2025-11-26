import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { Card, Title, Paragraph, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { auth } from '../firebaseConfig'; // ensure you export auth
import { Platform } from 'react-native';

// const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_BASE_URL = `http://192.168.0.106:8000`;

const NewsCard = ({ image, title, description, link, articleId,category }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Animated values for button feedback
  const likeScale = useRef(new Animated.Value(1)).current;
  const dislikeScale = useRef(new Animated.Value(1)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;

  const pulse = (anim) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 1.4, useNativeDriver: true, friction: 6 }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 6 }),
    ]).start();
  };

  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const sendAction = async (data) => {
  if (!userId) return;
  try {
    const payload = {
      user_id: userId,
      article_id: articleId,
      title: title,
      description: description,
      url: link,
      image: image?.uri ?? image,
      category: category,
      liked: false,
      disliked: false,
      bookmarked: false,
      read: false,
      ...data, // override with action
    };
    console.log('POST action payload:', payload);
    await axios.post(`${API_BASE_URL}/api/users/user/action`, payload);
  } catch (err) {
    console.error("Error storing action:", err?.response?.data ?? err);
  }
};


  const handlePress = () => {
    navigation.navigate('NewsDetail', { title, image, description, link });
    sendAction({ read: true });
  };

  const toggleLike = () => {
    const newLike = !liked;
    setLiked(newLike);
    if (disliked) setDisliked(false);
    sendAction({ liked: newLike, disliked: false });
    pulse(likeScale);
  };

  const toggleDislike = () => {
    const newDislike = !disliked;
    setDisliked(newDislike);
    if (liked) setLiked(false);
    sendAction({ disliked: newDislike, liked: false });
    pulse(dislikeScale);
  };

  const toggleBookmark = () => {
    const newBookmark = !bookmarked;
    setBookmarked(newBookmark);
    sendAction({ bookmarked: newBookmark });
    pulse(bookmarkScale);
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
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <IconButton
                icon={liked ? 'thumb-up' : 'thumb-up-outline'}
                iconColor={liked ? '#4CAF50' : '#777'}
                size={22}
                onPress={toggleLike}
              />
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: dislikeScale }] }}>
              <IconButton
                icon={disliked ? 'thumb-down' : 'thumb-down-outline'}
                iconColor={disliked ? '#E53935' : '#777'}
                size={22}
                onPress={toggleDislike}
              />
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
              <IconButton
                icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
                iconColor={bookmarked ? '#FFD54F' : '#777'}
                size={22}
                onPress={toggleBookmark}
              />
            </Animated.View>
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
