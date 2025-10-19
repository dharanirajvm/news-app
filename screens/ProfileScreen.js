import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { 
  Bookmark, 
  Heart, 
  Settings, 
  Calendar,
  Share2,
  MoreVertical
} from 'lucide-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('saved');
  const [profileName, setProfileName] = useState('Dharaniraj');
  const [profileEmail, setProfileEmail] = useState('');
  const [avatarSource, setAvatarSource] = useState(require('../assets/profile_pic.jpg'));

  useEffect(() => {
    (async () => {
      try {
        const savedName = await AsyncStorage.getItem('@profile_name');
        const savedEmail = await AsyncStorage.getItem('@profile_email');
        const savedAvatar = await AsyncStorage.getItem('@profile_avatar');
        if (savedName) setProfileName(savedName);
        if (savedEmail) setProfileEmail(savedEmail);
        if (savedAvatar) setAvatarSource({ uri: savedAvatar });
      } catch (e) {
        console.warn('Failed to load profile in ProfileScreen', e);
      }
    })();
  }, []);

  // Mock data for saved articles
  const savedArticles = [
    {
      id: '1',
      title: 'The Future of Renewable Energy',
      excerpt: 'Exploring how solar and wind power are transforming the global energy landscape...',
      image: 'https://images.unsplash.com/photo-1608447718455-ed5006c46051?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8MyUyMGdyYXBoaWNzfGVufDB8fDB8fHww',
      date: '2 hours ago',
      readTime: '5 min read',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Global Economic Trends in 2024',
      excerpt: 'Analysis of emerging markets and their impact on worldwide economic stability...',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNsYXNzcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      date: '1 day ago',
      readTime: '8 min read',
      category: 'Business'
    },
    {
      id: '3',
      title: 'Advancements in AI Healthcare Solutions',
      excerpt: 'How artificial intelligence is revolutionizing diagnostics and patient care...',
      image: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D',
      date: '2 days ago',
      readTime: '6 min read',
      category: 'Health'
    }
  ];

  // Mock data for liked articles
  const likedArticles = [
    {
      id: '4',
      title: 'Sustainable Architecture Innovations',
      excerpt: 'New eco-friendly building materials that reduce carbon footprint...',
      image: 'https://images.unsplash.com/photo-1727189899461-b888a5890287?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MyUyMGdyYXBoaWNzfGVufDB8fDB8fHww',
      date: '3 hours ago',
      readTime: '4 min read',
      category: 'Environment'
    },
    {
      id: '5',
      title: 'The Psychology of Digital Minimalism',
      excerpt: 'Understanding how reducing screen time can improve mental wellbeing...',
      image: 'https://images.unsplash.com/photo-1660142107232-e26dd2036dd8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D',
      date: '1 day ago',
      readTime: '7 min read',
      category: 'Lifestyle'
    }
  ];

  const renderArticleCard = (article) => (
    <View key={article.id} style={styles.card}>
      <Image 
        source={{ uri: article.image }} 
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <View style={styles.cardMetaRow}>
          <Text style={styles.categoryBadge}>{article.category}</Text>
          <Text style={styles.metaText}>{article.date}</Text>
        </View>
        <Text style={styles.cardTitle}>{article.title}</Text>
        <Text style={styles.cardExcerpt}>{article.excerpt}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.metaText}>{article.readTime}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity>
              <Share2 size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MoreVertical size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            // optional explicit navigation; App.js onAuthStateChanged will also switch screens
            //navigation.navigate('Login');
          } catch (err) {
            console.warn('Logout failed', err);
            Alert.alert('Error', err.message || 'Failed to logout.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Settings')}>
            <Settings size={24} color="#3498DB" />
          </TouchableOpacity>
        </View>
        {/* Profile Info */}
        <View style={styles.profileRow}>
            <Image 
              source={avatarSource}
              style={styles.avatar}
            />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileName}</Text>
            <Text style={styles.profileSubtitle}>{profileEmail || 'Topper'}</Text>
            <View style={styles.joinedRow}>
              <Calendar size={14} color="#94a3b8" />
              <Text style={styles.joinedText}>Joined Jan 2023</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>87</Text>
            <Text style={styles.statLabel}>Liked</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>128</Text>
            <Text style={styles.statLabel}>Read</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'saved' ? styles.tabActiveSaved : null]}
          onPress={() => setActiveTab('saved')}
        >
          <View style={styles.tabInner}>
            <Bookmark size={18} color={activeTab === 'saved' ? '#3498DB' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'saved' ? styles.tabTextActiveSaved : null]}>Saved</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'liked' ? styles.tabActiveLiked : null]}
          onPress={() => setActiveTab('liked')}
        >
          <View style={styles.tabInner}>
            <Heart size={18} color={activeTab === 'liked' ? '#E74C3C' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'liked' ? styles.tabTextActiveLiked : null]}>Liked</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'saved' ? (
          savedArticles.map(renderArticleCard)
        ) : (
          likedArticles.map(renderArticleCard)
        )}
      </ScrollView>

      {/* Logout row */}
      <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
        <View style={styles.rowLeft}>
          <MaterialCommunityIcons name="logout" size={22} color="#e53935" />
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#fff', paddingTop: 32, paddingBottom: 16, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1f2937' },
  iconButton: { padding: 8 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  profileInfo: { marginLeft: 12 },
  profileName: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  profileSubtitle: { color: '#4b5563', marginTop: 2 },
  joinedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  joinedText: { color: '#6b7280', marginLeft: 6, fontSize: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  statLabel: { color: '#6b7280', fontSize: 12 },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', marginTop: 12, marginHorizontal: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabInner: { flexDirection: 'row', alignItems: 'center' },
  tabText: { marginLeft: 8, fontWeight: '500', color: '#6b7280' },
  tabActiveSaved: { borderBottomWidth: 3, borderBottomColor: '#3498DB' },
  tabActiveLiked: { borderBottomWidth: 3, borderBottomColor: '#e74c3c' },
  tabTextActiveSaved: { color: '#3498DB' },
  tabTextActiveLiked: { color: '#e74c3c' },
  content: { flex: 1, paddingHorizontal: 16, marginTop: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  cardImage: { width: '100%', height: 160 },
  cardContent: { padding: 12 },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { fontSize: 12, fontWeight: '500', color: '#2563eb', backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  metaText: { fontSize: 12, color: '#6b7280' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  cardExcerpt: { color: '#4b5563', fontSize: 14, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  logoutRow: {
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  logoutText: {
    marginLeft: 12,
    color: '#e53935',
    fontWeight: '600',
    fontSize: 16,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
});

export default ProfileScreen;
