import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Appbar, Portal, Modal, TextInput, Button, ToggleButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import ProfileCard from '../components/ProfileCard';
const profilePic = require('../assets/profile_pic.jpg.jpg');

const ProfileScreen = () => {
  const [avatarUri, setAvatarUri] =  React.useState(profilePic);
  const [name, setName] = React.useState('Dharaniraj');
  const [subtitle, setSubtitle] = React.useState('Topper');
  const [bio, setBio] = React.useState(
    'Loves tracking technology and world news — reads 3 different sources daily to spot trends and bias.'
  );

  const [tab, setTab] = React.useState('personal');

  const [isEditVisible, setIsEditVisible] = React.useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access photo library is required to choose a profile photo.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled || result.cancelled) return;

      const uri = result.assets && result.assets.length > 0 ? result.assets[0].uri : result.uri;
      if (uri) setAvatarUri(uri);
    } catch (err) {
      console.error('Image picker error', err);
      Alert.alert('Error', 'Could not open image library.');
    }
  };

  const openEdit = () => setIsEditVisible(true);
  const closeEdit = () => setIsEditVisible(false);

  const saveProfile = () => {
    // For now, local state updated already. Close modal.
    closeEdit();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
        <Appbar.Action icon="pencil" onPress={openEdit} />
      </Appbar.Header>

      <ToggleButton.Row onValueChange={setTab} value={tab} style={styles.segment}>
        <ToggleButton icon="account" value="personal" accessibilityLabel="Personal Info" />
        <ToggleButton icon="tune" value="preferences" accessibilityLabel="Preferences" />
      </ToggleButton.Row>

      {tab === 'personal' ? (
        <ProfileCard name={name} subtitle={subtitle} avatarUri={avatarUri} bio={bio} />
      ) : (
        <View style={styles.prefContainer}>
          <Text variant="titleMedium">Preferences</Text>
          <Text style={{ marginTop: 8, color: '#444' }}>
            No category preferences configured. You can set notification or theme preferences here later.
          </Text>
        </View>
      )}

      <Portal>
        <Modal visible={isEditVisible} onDismiss={closeEdit} contentContainerStyle={styles.modalContainer}>
          <Text variant="titleLarge" style={{ marginBottom: 12 }}>Edit Profile</Text>

          <Button mode="outlined" onPress={pickImage} style={{ marginBottom: 12 }}>
            Choose Photo
          </Button>

          <TextInput label="Name" value={name} onChangeText={setName} style={{ marginBottom: 8 }} />
          <TextInput label="Subtitle" value={subtitle} onChangeText={setSubtitle} style={{ marginBottom: 8 }} />
          <TextInput label="Bio" value={bio} onChangeText={setBio} multiline numberOfLines={3} style={{ marginBottom: 12 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button onPress={closeEdit} mode="outlined" style={{ marginRight: 8 }}>Cancel</Button>
            <Button onPress={saveProfile} mode="contained">Save</Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
  modalContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    // Ensure modal isn't full-screen and is centered
    alignSelf: 'center',
    width: '90%',
    elevation: 6,
  },
  segment: { marginTop: 12, marginBottom: 8 },
  prefContainer: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginTop: 8 },
  card: { marginTop: 12, padding: 8 },
  bioTitle: { marginTop: 8, fontWeight: '600' },
  bioText: { marginTop: 6, color: '#444', lineHeight: 20 },
});

export default ProfileScreen;
