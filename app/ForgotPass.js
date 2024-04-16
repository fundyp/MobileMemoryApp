import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES } from "../constants"; // Import constants

const apiURL = "https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  // Function to handle password recovery
  const handleRecover = async () => {
    if (email) {
      try {
        const response = await fetch(apiURL + "/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        });
        const textResponse = await response.text();
        console.log("Response from server:", textResponse); // Log the response from the server
        const data = await response.json();
        if (response.ok) {
          Alert.alert("Success", "Password recovery email sent successfully!");
          setEmail(""); // Clear input field after recovery request
        } else {
          Alert.alert("Error", data.error || "Password recovery request failed. Please try again.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again later.");
        console.error("Error:", error);
      }
    } else {
      Alert.alert("Error", "Please enter your email.");
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
      <TouchableOpacity style={styles.button} onPress={handleRecover}>
        <Text style={styles.buttonText}>Recover</Text>
      </TouchableOpacity>
      <View style={styles.signUpContainer}>

      <Text style={styles.signUpText}></Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.signUpLink, {color: "#CD85F0"}]}>Go Back</Text>
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
  signUpText: {
    color: "white",
    fontSize: SIZES.body3,
  },
  signUpLink: {
    textDecorationLine: "underline",
  },

});

export default ForgotPass;