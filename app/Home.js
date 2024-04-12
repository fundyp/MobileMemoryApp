import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";

const Home = () => {
  // Access the route and get the parameter (user's first name)
  const route = useRoute();
  const navigation = useNavigation();
  const { firstName } = route.params || {};

  // Function to handle sign-out
  const handleSignOut = () => {
    // Add your sign-out logic here, such as clearing local storage or resetting authentication state
    navigation.navigate("Login"); // Navigate to the Login screen after sign-out
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome To MemoryMap {firstName || "User"}!</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.6024, // UCF Lat and long :D
          longitude: -81.2001, 
          latitudeDelta: 10, // zoom level
          longitudeDelta: 10, 
        }}
      />
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
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
  text: {
    color: "white", // Change text color to white
    fontSize: 24, // Adjust font size as needed
  },
  map: {
    width: "95%",
    height: "50%",
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: "#CD85F0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

export default Home;