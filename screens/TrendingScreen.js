import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Mic, X, Search, MapPin, Clock, User } from "lucide-react-native";
import * as Location from "expo-location";
import axios from "axios";
import { API_KEY } from "@env";
import NewsCard from "../components/NewsCard";
import Voice from '@react-native-voice/voice';
import { NativeModules, Platform } from 'react-native';

export default function LocationNewsScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Fetching...");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSearchText, setVoiceSearchText] = useState("");
  const searchRef = useRef(null);

  // 🔹 Fetch location and initial news
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required for local news");
        setLoading(false);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const [reverse] = await Location.reverseGeocodeAsync(location.coords);
        const city = reverse?.district || reverse?.city || "India";
        setLocationName(city);
        fetchNews(city);
      } catch (err) {
        console.error("Error fetching location:", err);
        setLocationName("India");
        fetchNews("India");
      }
    })();
  }, []);

  // 🔹 Fetch news from API
  const fetchNews = async (query) => {
    setLoading(true);
    setError("");
    try {
      const API_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&q=${encodeURIComponent(
        query
      )}`;
      const response = await axios.get(API_URL);
      const articles = response.data?.results || [];
      const uniqueNews = articles.filter(
        (item, index, self) => index === self.findIndex((t) => t.link === item.link)
      );
      setNews(uniqueNews);
      if (uniqueNews.length === 0) 
      {
        //show alert("No news found for your search. Showing latest news instead.");
        Alert.alert("No News Found", "No news found for your search. Showing latest news instead.");
        // show the news for the keyword 'latest'
        fetchNews("latest");

      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch news.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle text search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchNews(locationName);
      return;
    }
    fetchNews(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchNews(locationName);
    searchRef.current?.focus();
  };

  // 🔹 Voice search simulation
  // Start real voice search using native voice module
  const startVoiceSearch = async () => {
    // Guard: when running in Expo Go or when native module isn't linked the native binding is missing
    const nativeVoice = NativeModules.RNVoice || NativeModules.Voice || NativeModules.RNVoiceModule || NativeModules.RNVoiceModuleIOS;
    if (!Voice || typeof Voice.start !== 'function' || !nativeVoice) {
      Alert.alert(
        'Voice unavailable',
        'Voice recognition requires a native build (EAS or eject).\n\nOptions:\n• Build a dev client with EAS or eject to run native modules, or\n• Use the app without voice or add a record+upload fallback for Expo Go.'
      );
      return;
    }

    try {
      setIsVoiceModalVisible(true);
      setIsListening(true);
      setVoiceSearchText('Listening...');
      await Voice.start('en-US');
    } catch (err) {
      console.error('Voice start error:', err);
      setIsListening(false);
      setIsVoiceModalVisible(false);
    }
  };

  const confirmVoiceSearch = () => {
    if (voiceSearchText && voiceSearchText !== "Listening...") {
      setSearchQuery(voiceSearchText);
      setIsVoiceModalVisible(false);
      fetchNews(voiceSearchText);
    }
  };
  // Voice event handlers
  useEffect(() => {
    // Event listeners
    Voice.onSpeechResults = (e) => {
      const text = e.value?.[0] || '';
      setVoiceSearchText(text);
      setIsListening(false);

      if (text) {
        setSearchQuery(text);
        setIsVoiceModalVisible(false);
        fetchNews(text);
      }
    };

    Voice.onSpeechError = (e) => {
      console.warn('Voice error', e);
      setIsListening(false);
      setIsVoiceModalVisible(false);
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const stopVoiceSearch = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Voice stop failed:', err);
    }
  };

  // 🔹 Render news cards
  const renderNewsItem = ({ item }) => (
    <NewsCard
      image={item.image_url ? { uri: item.image_url } : require("../assets/news_image5.jpg")}
      title={item.title}
      description={item.description || "No description available."}
      link={item.link}
    />
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#391a65ff" />
        <Text style={{ marginTop: 8, color: "#666" }}>Loading latest news...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* App Header */}
      <View style={{ backgroundColor: "#2C3E50", paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>LocalNews</Text>
    
        </View>

        {/* Location */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <MapPin size={18} color="white" />
          <Text style={{ color: "white", fontSize: 16, marginLeft: 8 }}>Current Location: {locationName}</Text>
        </View>

        {/* Search Bar */}
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 50, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Search size={20} color="#7F8C8D" />
          <TextInput
            ref={searchRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholder="Search news..."
            style={{ flex: 1, marginHorizontal: 8, fontSize: 16 }}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#7F8C8D" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startVoiceSearch} style={{ marginLeft: 8, backgroundColor: "#EAF4FF", padding: 8, borderRadius: 50 }}>
              <Mic size={20} color="#3498DB" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* News List */}
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={(item, index) => item.article_id || index.toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Text style={{ color: "#888", fontSize: 16 }}>No news found</Text>
          </View>
        }
      />

      {/* Voice Search Modal */}
      <Modal visible={isVoiceModalVisible} transparent animationType="slide" onRequestClose={() => setIsVoiceModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 16 }}>
          <View style={{ backgroundColor: "white", borderRadius: 20, padding: 24, width: "100%" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 12 }}>Voice Search</Text>
            <Text style={{ textAlign: "center", color: "#777", marginBottom: 20 }}>Speak to search for local news</Text>

            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: isListening ? "#EAF4FF" : "#EEE", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Mic size={64} color={isListening ? "#3498DB" : "#7F8C8D"} />
              </View>
              <Text style={{ fontSize: 16, color: "#555", textAlign: "center" }}>{voiceSearchText || "Tap microphone and speak"}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={() => setIsVoiceModalVisible(false)} style={{ backgroundColor: "#EEE", borderRadius: 30, paddingHorizontal: 24, paddingVertical: 10 }}>
                <Text style={{ color: "#333", fontWeight: "500" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmVoiceSearch} disabled={isListening || !voiceSearchText} style={{ backgroundColor: isListening || !voiceSearchText ? "#AAA" : "#3498DB", borderRadius: 30, paddingHorizontal: 24, paddingVertical: 10 }}>
                <Text style={{ color: "white", fontWeight: "500" }}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
