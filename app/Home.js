import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const Home = () => {
  // Access the route and get the parameter (user's first name)
  const route = useRoute();
  const { firstName } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello {firstName || "User"}!</Text>
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
});

export default Home;