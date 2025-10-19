import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from "../firebaseConfig";

export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // set displayName on the Firebase user
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (fullName) {
        await updateProfile(userCredential.user, { displayName: fullName });
        // persist for Settings screen fallback
        await AsyncStorage.setItem('@profile_name', fullName);
      }
      await AsyncStorage.setItem('@profile_email', email);
      // navigate to Home tab inside MainTabs
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.logoText}>Indroru Seythi</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#999"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#999"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Signup</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or Signup Using</Text>
      <View style={styles.socialContainer}>
        <View style={styles.socialButton}>
          <Image
            source={require("../assets/google.png")}
            style={styles.socialIcon}
          />
        </View>
        <View style={styles.socialButton}>
          <Image
            ource={require("../assets/facebook.png")}
            style={styles.socialIcon}
          />
        </View>
      </View>

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, marginTop: 50 },
  headerSection: { alignItems: "center", marginBottom: 20 },
  logoText: { fontSize: 28, fontWeight: "bold", color: "#5E17EB" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#5E17EB",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  signupButtonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  orText: { textAlign: "center", color: "#999", marginVertical: 15 },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
  },
  socialIcon: { width: 30, height: 30 },
  footerText: { textAlign: "center", marginTop: 15, color: "#666" },
  linkText: { color: "#5E17EB", fontWeight: "600" },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
});
