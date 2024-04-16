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
import { COLORS, SIZES } from "../constants";

const apiURL = "https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const goToHome = async () => {
    if (firstName && lastName && username && email && password) {
      try {
        const response = await fetch(apiURL + "/createuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          Alert.alert("Success", "Sign-up successful!");
          setFirstName("");
          setLastName("");
          setUsername("");
          setEmail("");
          setPassword("");
          // go to home and pass down userID and the first name that was inserted (not retrieved from database)
          navigation.navigate("Home", {
            userId: data.userId,
            firstName: firstName,
          });
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
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={[styles.input, firstName ? styles.filledInput : null]}
        placeholder="Enter First Name"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={[styles.input, lastName ? styles.filledInput : null]}
        placeholder="Enter Last Name"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
      />
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={[styles.input, username ? styles.filledInput : null]}
        placeholder="Enter Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
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
      <TouchableOpacity style={styles.button} onPress={goToHome}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.signInLink, {color: "#CD85F0"}]}>Sign In</Text>
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
    color: "white",
    fontSize: SIZES.body3,
    marginBottom: 5,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "white",
  },
  filledInput: {
    backgroundColor: "white",
    color: "black",
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "#CD85F0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
    fontSize: SIZES.body3,
  },
  signInContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signInText: {
    color: "white",
    fontSize: SIZES.body3,
  },
  signInLink: {
    textDecorationLine: "underline",
  },
});

export default SignUp;
