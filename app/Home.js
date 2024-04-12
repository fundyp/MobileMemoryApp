import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { useRoute } from "@react-navigation/native";

const Home = () => {
  // Access the route and get the parameter (user's first name)
  const route = useRoute();
  const { firstName } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome {firstName || "User"}!</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.5, // Adjust the latitudeDelta to zoom out further
          longitudeDelta: 0.5, // Adjust the longitudeDelta to zoom out further
        }}
      />
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
});

export default Home;