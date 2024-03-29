import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, World!</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ color: "blue", marginTop: 20 }}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});

export default HomeScreen;
