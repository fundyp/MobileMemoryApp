import React, { useState } from "react";

import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { COLORS, SIZES } from "../constants"; // Import your constants from the correct path

const apiURL = "https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const goToHomePage = () => {
    navigation.navigate("SignUp"); // Navigate to the 'Profile' screen
  };

  const handleSignIn = async () => {
    // Log the data before sending
    console.log("Data to be sent:", {
      email: email,
      password: password,
    });
    if (email && password) {
      try {
        const response = await fetch(apiURL + "/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: email,
            password: password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          Alert.alert("Success", "Sign-In successful!");
          // Clear input fields after sign-up
          setEmail("");
          setPassword("");

          navigation.navigate("Home");
        } else {
          Alert.alert(
            "Error",
            data.error || "Sign-up failed. Please try again."
          );
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again later.");
        console.error("Error:", error);
      }
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, email ? styles.filledInput : null]}
        placeholder="Enter Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[styles.input, password ? styles.filledInput : null]}
        placeholder="Enter Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToHomePage}>
        <Text
          style={{
            color: "#CD85F0",
            marginTop: 20,
            textDecorationLine: "underline",
          }}
        >
          Sign-Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black", // Change background color to black
  },
  label: {
    color: "white", // Change label text color to white
    fontSize: SIZES.body3,
    marginBottom: 5, // Add margin bottom to labels for spacing
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "white", // Default text color is white
  },
  filledInput: {
    backgroundColor: "white", // Background color changes to white when filled
    color: "black", // Text color changes to black when filled
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "#CD85F0", // Change button color to light purple
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "black", // Change button text color to black
    fontSize: SIZES.body3,
  },
});

export default Login;
