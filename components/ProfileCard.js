import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
const profilePic = require('../assets/profile_pic.jpg.jpg');

const ProfileCard = ({ name = 'Dharaniraj', subtitle = 'Journalist', avatarUri = profilePic, bio }) => {
  return (
    <Card style={styles.card}>
      {/* Custom header: avatar left, texts on right */}
      <Card.Content>
        <View style={styles.header}>
          <Avatar.Image size={72} source={typeof avatarUri === 'string' ? { uri: avatarUri } : avatarUri} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text variant="titleLarge" style={styles.name}>{name}</Text>
            <Text variant="bodySmall" style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <Text style={styles.bioTitle} variant="titleMedium">
          Interesting Fact
        </Text>
        <Text style={styles.bioText} variant="bodyMedium">
          {bio || 'Loves tracking technology and world news — reads 3 sources daily.'}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginTop: 12, padding: 8 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { marginRight: 12 },
  headerText: { flex: 1, justifyContent: 'center' },
  name: { fontWeight: '700' },
  subtitle: { color: '#666', marginTop: 2 },
  bioTitle: { marginTop: 8, fontWeight: '600' },
  bioText: { marginTop: 6, color: '#444', lineHeight: 20 },
});

export default ProfileCard;
