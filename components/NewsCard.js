import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph, useTheme } from 'react-native-paper';

const NewsCard = ({ image, title, description }) => {
  const { colors } = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <Card.Cover source={image} style={styles.cardImage} />
      <Card.Content>
        <Title style={styles.cardTitle}>{title}</Title>
        <Paragraph style={styles.cardDescription}>{description}</Paragraph>
      </Card.Content>
    </Card>
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
});

export default NewsCard;