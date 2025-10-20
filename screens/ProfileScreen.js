import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Bookmark, Heart, Settings, Calendar, Share2, MoreVertical } from 'lucide-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE_URL = `http://192.168.0.106:8000/api/users/user`;

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('saved');
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [stats, setStats] = useState({ likes_count: 0, bookmarks_count: 0, read_count: 0 });
  const [likedArticles, setLikedArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const fetchUserData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [actionsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/actions/${userId}`),
        axios.get(`${API_BASE_URL}/stats/${userId}`)
      ]);

      const actions = Array.isArray(actionsRes.data) ? actionsRes.data : [];
      const liked = actions.filter(a => a.liked);
      const bookmarked = actions.filter(a => a.bookmarked);

      setLikedArticles(liked);
      setSavedArticles(bookmarked);
      setStats(statsRes.data ?? { likes_count: 0, bookmarks_count: 0, read_count: 0 });
    } catch (err) {
      console.error('Error fetching profile data:', err?.response?.data ?? err.message ?? err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  // refresh handler used by RefreshControl
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
  }, [fetchUserData]);

  // fetch every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      setProfileName(user.displayName || 'User');
      setProfileEmail(user.email || '');
      fetchUserData();
      // no cleanup required
    }, [userId, user?.displayName, user?.email, fetchUserData])
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
          } catch (err) {
            Alert.alert('Error', err.message || 'Failed to logout.');
          }
        },
      },
    ]);
  };

  const renderArticleCard = (article) => (
    <View key={article.article_id} style={styles.card}>
      <Image source={{ uri: article.image }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardContent}>
        <Text style={styles.categoryBadge}>Article</Text>
        <Text style={styles.cardTitle}>{article.title}</Text>
        <Text style={styles.cardExcerpt}>{article.description}</Text>
        <View style={styles.cardFooter}>
          <TouchableOpacity onPress={() => navigation.navigate('NewsDetail', { title: article.title, image: { uri: article.image }, description: article.description, link: article.url })}>
            <Text style={{ color: '#3498DB' }}>Read more →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#3498DB" /></View>;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Settings size={24} color="#3498DB" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileRow}>
          <Image source={require('../assets/profile_pic.jpg')} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileName}</Text>
            <Text style={styles.profileSubtitle}>{profileEmail}</Text>
            <View style={styles.joinedRow}>
              <Calendar size={14} color="#94a3b8" />
              <Text style={styles.joinedText}>Joined Jan 2023</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.bookmarks_count}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.likes_count}</Text>
            <Text style={styles.statLabel}>Liked</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.read_count}</Text>
            <Text style={styles.statLabel}>Read</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'saved' && styles.tabActiveSaved]} onPress={() => setActiveTab('saved')}>
          <Bookmark size={18} color={activeTab === 'saved' ? '#3498DB' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActiveSaved]}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'liked' && styles.tabActiveLiked]} onPress={() => setActiveTab('liked')}>
          <Heart size={18} color={activeTab === 'liked' ? '#E74C3C' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'liked' && styles.tabTextActiveLiked]}>Liked</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3498DB']} />
        }
      >
        {activeTab === 'saved'
          ? savedArticles.map(renderArticleCard)
          : likedArticles.map(renderArticleCard)}
      </ScrollView>

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
