import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Image
          source={require("../assets/news_icon.png")}
          style={styles.illustration}
        />
        <Text style={styles.logoText}>Indroru Seythi</Text>
        <Text style={styles.subtitle}>
          Your daily briefing, no nonsense included! A platform where you get to the heart of every story!!
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signupButtonText}>Signup</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or Login Using</Text>
        <View style={styles.socialContainer}>
          <View style={styles.socialButton}>
            <Image
              source={require("../assets/google.png")}
              style={styles.socialIcon}
            />
          </View>
          <View style={styles.socialButton}>
            <Image
              source={require("../assets/facebook.png")}
              style={styles.socialIcon}
            />
          </View>
        </View>

        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("Signup")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  headerSection: { alignItems: "center", marginTop: 60, marginBottom: 30 },
  illustration: { width: 120, height: 120, marginBottom: 15 },
  logoText: { fontSize: 28, fontWeight: "bold", color: "#5E17EB" },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    paddingHorizontal: 20,
    fontSize: 13,
  },
  formContainer: { marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#5E17EB",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  loginButtonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  signupButton: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  signupButtonText: { color: "#555", textAlign: "center", fontSize: 16 },
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
