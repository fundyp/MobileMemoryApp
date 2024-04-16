import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from "react-native"; // Import Image from "react-native"
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES } from "../constants"; // Import constants

const apiURL = "https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // Function to navigate to Home screen with user's first name as parameter
  const goToHomePage = (firstName, username) => {
    navigation.navigate("Home", { firstName, username });
  };

  // Function to handle sign-in
  const handleSignIn = async () => {
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
          //Alert.alert("Success", "Sign-In successful!");

          // Clear input fields after sign-up
          setEmail("");
          setPassword("");

          // Call goToHomePage with user's first name and username
          goToHomePage(data.firstName, data.username); // Pass username received from the API
        } else {
          Alert.alert("Error", data.error || "Sign-in failed. Please try again.");
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
      <Image
        source={require("../constants/memMapLogo.png")} // Adjust the path to your image file
        style={styles.logo}
      />
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
      <View style={styles.signUpContainerTwo}>
      <Text style={styles.signUpText}>Forgot Password? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
          <Text style={[styles.signUpLink, {color: "#CD85F0"}]}>Reset Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Dont Have An Account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={[styles.signUpLink, {color: "#CD85F0"}]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#130F15", // Change background color to black
    marginTop: -100,
    marginBottom: -100,
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
  signUpContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signUpContainerTwo: {
    flexDirection: "row",
    marginTop: 0,
    marginBottom: 10,
  },
  signUpText: {
    color: "white",
    fontSize: SIZES.body3,
  },
  signUpLink: {
    textDecorationLine: "underline",
  },
  logo: {
    width: 220,
    height: 200,
    marginBottom: 100,
  },
});

export default Login;