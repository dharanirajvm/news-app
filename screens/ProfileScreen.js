import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Appbar, Avatar, Text, Button, useTheme } from 'react-native-paper';

const ProfileScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <Avatar.Image
          size={120}
          source={require('../assets/profile_pic.jpg.jpg')}
          style={styles.avatar}
        />
        <Text style={[styles.userName, { color: colors.onSurface }]}>Dharaniraj VM</Text>
        <Text style={[styles.userDetails, { color: colors.onSurfaceVariant }]}>dharaniraj2205@gmail.com</Text>
        <Text style={[styles.userDetails, { color: colors.onSurfaceVariant }]}>Joined: January 1, 2023</Text>
        
        <Button 
          mode="contained" 
          onPress={() => console.log('Edit Profile Pressed')}
          style={styles.editButton}
        >
          Edit Profile
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 16,
    marginBottom: 4,
  },
  editButton: {
    marginTop: 20,
    width: '80%',
  },
});

export default ProfileScreen;