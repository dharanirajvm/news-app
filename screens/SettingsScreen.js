import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, Image, TouchableOpacity, Switch, Dimensions, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Modal } from 'react-native-paper';
import {
  ChevronRight,
  Calendar,
  User,
  Bell,
  Palette,
  Shield,
  BarChart3,
  Moon,
  Mail,
  Lock,
  Globe,
  Info,
  ChevronDown,
  Edit3,
} from 'lucide-react-native';
import { LineChart } from 'react-native-gifted-charts';
import { TextInput, Button, Portal } from 'react-native-paper';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const screenWidth = Dimensions.get('window').width;

  // Mock data for analysis graph
  const lineData = [
    { value: 15, label: 'Mon' },
    { value: 30, label: 'Tue' },
    { value: 26, label: 'Wed' },
    { value: 40, label: 'Thu' },
    { value: 35, label: 'Fri' },
    { value: 50, label: 'Sat' },
    { value: 45, label: 'Sun' },
  ];

  const [profileName, setProfileName] = useState('Alex Morgan');
  const [profileEmail, setProfileEmail] = useState('alex.morgan@example.com');
  const [avatarUri, setAvatarUri] = useState(null);


  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);
  const [editField, setEditField] = useState(null); // 'name' | 'email'
  const [tempValue, setTempValue] = useState('');

  const openEdit = (field) => {
    setEditField(field);
    setTempValue(field === 'name' ? profileName : profileEmail);
    setIsEditModalVisible(true);
  };

  const closeEdit = () => {
    setIsEditModalVisible(false);
    setEditField(null);
    setTempValue('');
  };

  const saveEdit = () => {
    if (editField === 'name') setProfileName(tempValue.trim() || profileName);
    if (editField === 'email') setProfileEmail(tempValue.trim() || profileEmail);
    closeEdit();
    // persist
    (async () => {
      try {
        if (editField === 'name') await AsyncStorage.setItem('@profile_name', tempValue.trim() || profileName);
        if (editField === 'email') await AsyncStorage.setItem('@profile_email', tempValue.trim() || profileEmail);
      } catch (e) {
        console.warn('Failed to save profile', e);
      }
    })();
  };

  const openPrivacy = () => setIsPrivacyVisible(true);
  const closePrivacy = () => setIsPrivacyVisible(false);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access photo library is required.');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && (result.assets?.length > 0 || result.uri)) {
        const uri = result.assets?.[0]?.uri || result.uri;
        setAvatarUri(uri);
        try { await AsyncStorage.setItem('@profile_avatar', uri); } catch (e) { console.warn('save avatar fail', e); }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not pick an image.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access camera is required.');
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && (result.assets?.length > 0 || result.uri)) {
        const uri = result.assets?.[0]?.uri || result.uri;
        setAvatarUri(uri);
        try { await AsyncStorage.setItem('@profile_avatar', uri); } catch (e) { console.warn('save avatar fail', e); }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not take a photo.');
    }
  };

  const onPressAvatar = () => {
    Alert.alert('Profile photo', 'Choose an option', [
      { text: 'Take Photo', onPress: () => takePhoto() },
      { text: 'Choose from Gallery', onPress: () => pickFromGallery() },
      { text: 'Remove Photo', onPress: async () => {
        try {
          await AsyncStorage.removeItem('@profile_avatar');
        } catch (e) { console.warn('remove avatar fail', e); }
        setAvatarUri(null);
      }},
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const renderGeneralSettings = () => (
    <View style={{ marginTop: 12 }}>
      {/* Personal Information */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitleLarge}>Personal Information</Text>
          <Text style={styles.cardSubtitle}>Update your personal details</Text>
        </View>

        <TouchableOpacity style={styles.row} onPress={() => openEdit('name')}>
          <View style={styles.rowLeft}>
            <User size={20} color="#3498DB" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.rowTitle}>Name</Text>
              <Text style={styles.rowSubtitle}>{profileName}</Text>
            </View>
          </View>
          <Edit3 size={20} color="#94a3b8" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row} onPress={() => openEdit('email')}>
          <View style={styles.rowLeft}>
            <Mail size={20} color="#3498DB" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.rowTitle}>Email</Text>
              <Text style={styles.rowSubtitle}>{profileEmail}</Text>
            </View>
          </View>
          <Edit3 size={20} color="#94a3b8" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Lock size={20} color="#3498DB" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.rowTitle}>Password</Text>
              <Text style={styles.rowSubtitle}>Change your password</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitleLarge}>Preferences</Text>
          <Text style={styles.cardSubtitle}>Customize your experience</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Bell size={20} color="#3498DB" />
            <Text style={[styles.rowTitle, { marginLeft: 12 }]}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: '#d1d5db', true: '#3498DB' }}
            thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setNotificationsEnabled}
            value={notificationsEnabled}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Moon size={20} color="#3498DB" />
            <Text style={[styles.rowTitle, { marginLeft: 12 }]}>Dark Mode</Text>
          </View>
          <Switch
            trackColor={{ false: '#d1d5db', true: '#3498DB' }}
            thumbColor={darkModeEnabled ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setDarkModeEnabled}
            value={darkModeEnabled}
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Palette size={20} color="#3498DB" />
            <Text style={[styles.rowTitle, { marginLeft: 12 }]}>Theme</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.rowSubtitle}>Blue</Text>
            <ChevronRight size={20} color="#94a3b8" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Security */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitleLarge}>Security</Text>
          <Text style={styles.cardSubtitle}>Manage your security settings</Text>
        </View>

        <TouchableOpacity style={styles.row} onPress={openPrivacy}>
          <View style={styles.rowLeft}>
            <Shield size={20} color="#3498DB" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.rowTitle}>Privacy Policy</Text>
              <Text style={styles.rowSubtitle}>Review our privacy policy</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Globe size={20} color="#3498DB" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.rowTitle}>Language</Text>
              <Text style={styles.rowSubtitle}>English</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitleLarge}>About</Text>
          <Text style={styles.cardSubtitle}>Learn more about NewsFlow</Text>
        </View>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Info size={20} color="#3498DB" />
            <Text style={[styles.rowTitle, { marginLeft: 12 }]}>About NewsFlow</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPreferencesSettings = () => (
    <View style={{ marginTop: 12 }}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitleLarge}>Notification Preferences</Text>
          <Text style={styles.cardSubtitle}>Choose when you want to be notified</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowTitle}>Email Notifications</Text>
          <Switch
            trackColor={{ false: '#d1d5db', true: '#3498DB' }}
            thumbColor={emailNotifications ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setEmailNotifications}
            value={emailNotifications}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBody}>
          <Text style={[styles.rowTitle, { marginBottom: 8 }]}>Preferred Categories</Text>
          <View style={styles.wrapRow}>
            {['Technology', 'Business', 'Health', 'Environment', 'Sports', 'Entertainment'].map((category) => (
              <View key={category} style={styles.badgeLight}>
                <Text style={styles.badgeText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitleLarge}>Reading Preferences</Text>
          <Text style={styles.cardSubtitle}>Customize your reading experience</Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.rowTitle, { marginBottom: 8 }]}>Reading Time</Text>
          <View style={styles.wrapRow}>
            {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
              <View key={time} style={styles.badgeOutline}>
                <Text style={styles.badgeTextDark}>{time}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderAnalysisSettings = () => (
    <View style={{ marginTop: 12 }}>
      <View style={[styles.card, { padding: 16 }]}>
        <Text style={styles.cardTitleLarge}>Reading Activity</Text>
        <Text style={styles.cardSubtitle}>Your reading habits over the past week</Text>

        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <LineChart
            areaChart
            data={lineData}
            width={screenWidth - 80}
            height={250}
            spacing={40}
            initialSpacing={20}
            hideDataPoints
            thickness={3}
            hideRules
            yAxisColor="#00000000"
            xAxisColor="#00000000"
            color="#3498DB"
            startFillColor="#3498DB"
            endFillColor="#3498DB"
            startOpacity={0.8}
            endOpacity={0.1}
            gradientEnabled
            curved
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          <View style={styles.centerItem}>
            <Text style={[styles.statNumber, { color: '#3498DB' }]}>24</Text>
            <Text style={styles.statLabel}>Articles Read</Text>
          </View>
          <View style={styles.centerItem}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>12</Text>
            <Text style={styles.statLabel}>New Topics</Text>
          </View>
          <View style={styles.centerItem}>
            <Text style={[styles.statNumber, { color: '#8B5CF6' }]}>42h</Text>
            <Text style={styles.statLabel}>Reading Time</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitleLarge}>Category Interests</Text>
          <Text style={styles.cardSubtitle}>Your preferred topics</Text>

          {[
            { category: 'Technology', percentage: 35 },
            { category: 'Business', percentage: 25 },
            { category: 'Health', percentage: 20 },
            { category: 'Environment', percentage: 12 },
            { category: 'Sports', percentage: 8 },
          ].map((item, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={styles.rowTitle}>{item.category}</Text>
                <Text style={styles.rowSubtitle}>{item.percentage}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${item.percentage}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile Info */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onPressAvatar}>
            <Image 
              source={avatarUri ? { uri: avatarUri } : require('../assets/profile_pic.jpg')} 
              style={{ width: 64, height: 64, borderRadius: 32 }}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.profileName}>Alex Morgan</Text>
            <Text style={styles.rowSubtitle}>News Enthusiast</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'general' ? styles.tabActive : null]} onPress={() => setActiveTab('general')}>
          <Text style={[styles.tabText, activeTab === 'general' ? styles.tabTextActive : null]}>General</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'preferences' ? styles.tabActive : null]} onPress={() => setActiveTab('preferences')}>
          <Text style={[styles.tabText, activeTab === 'preferences' ? styles.tabTextActive : null]}>Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'analysis' ? styles.tabActive : null]} onPress={() => setActiveTab('analysis')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BarChart3 size={18} color={activeTab === 'analysis' ? '#3498DB' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'analysis' ? styles.tabTextActive : null, { marginLeft: 6 }]}>Analysis</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'preferences' && renderPreferencesSettings()}
        {activeTab === 'analysis' && renderAnalysisSettings()}
      </ScrollView>

      {/* Edit Modal */}
      <Portal>
        <Modal visible={isEditModalVisible} onDismiss={closeEdit} contentContainerStyle={styles.modalContainer}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>{editField === 'name' ? 'Edit Name' : 'Edit Email'}</Text>
          <TextInput mode="outlined" label={editField === 'name' ? 'Name' : 'Email'} value={tempValue} onChangeText={setTempValue} style={{ marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button onPress={closeEdit} mode="outlined" style={{ marginRight: 8 }}>Cancel</Button>
            <Button onPress={saveEdit} mode="contained">Save</Button>
          </View>
        </Modal>
      </Portal>

      {/* Privacy Modal */}
      <Portal>
        <Modal visible={isPrivacyVisible} onDismiss={closePrivacy} contentContainerStyle={styles.modalContainerLarge}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Privacy Policy</Text>
          <ScrollView style={{ maxHeight: 320, marginBottom: 12 }}>
            <Text style={{ marginBottom: 8 }}>
              This is a sample privacy policy for NewsFlow. We collect and process data necessary to provide and improve the service. We do not sell personal data. Data collected may include usage statistics, device identifiers, and profile information you provide.
            </Text>
            <Text style={{ marginBottom: 8 }}>
              If you have questions about your data, contact support@example.com. By using the app you consent to the collection and use of information as described in this policy.
            </Text>
            <Text>
              (This is placeholder text — replace with your full legal privacy policy.)
            </Text>
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button onPress={closePrivacy} mode="contained">Close</Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { backgroundColor: '#fff', paddingTop: 32, paddingBottom: 12, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1f2937' },
  profileName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', marginTop: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontWeight: '600', color: '#6b7280' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#3498DB' },
  tabTextActive: { color: '#3498DB' },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden' },
  cardHeader: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  cardTitleLarge: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  cardSubtitle: { color: '#6b7280', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { fontWeight: '600', color: '#111827' },
  rowSubtitle: { color: '#6b7280', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 12 },
  cardBody: { padding: 12 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeLight: { backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginRight: 8, marginBottom: 8 },
  badgeText: { color: '#1D4ED8', fontSize: 13 },
  badgeOutline: { borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginRight: 8, marginBottom: 8 },
  badgeTextDark: { color: '#374151', fontSize: 13 },
  centerItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#6b7280', fontSize: 12 },
  progressTrack: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 999 },
  progressFill: { height: 8, backgroundColor: '#2563EB', borderRadius: 999 },
  modalContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    alignSelf: 'center',
    width: '90%',
    elevation: 6,
  },
  modalContainerLarge: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    alignSelf: 'center',
    width: '92%',
    elevation: 6,
  },
});

export default SettingsScreen;
