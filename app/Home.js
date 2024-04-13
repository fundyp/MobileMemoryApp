import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import MapView from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { firstName } = route.params || {};

  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = () => {
    navigation.navigate("Login");
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const menuItems = [
    { id: 1, title: "Sign Out", onPress: handleSignOut },
    // Add more menu items here if needed
  ];

  return (
    <View style={styles.container}>
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={toggleMenu}>
          <Image
            source={require("../constants/pngwing.com.png")}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <View style={styles.actionBarTextContainer}>
          <Text style={styles.actionBarText}>{firstName}'s Memory Map</Text>
        </View>
      </View>
      {showMenu && (
        <View style={styles.dropdown}>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={item.onPress}>
                <Text style={styles.menuItem}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.6024,
          longitude: -81.2001,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  actionBar: {
    backgroundColor: "#553A65",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  dropdown: {
    position: "absolute",
    top: 60,
    right: 10,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 3,
    zIndex: 1000,
  },
  menuItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  actionBarTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  actionBarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  map: {
    flex: 0.7,
    marginHorizontal: 5,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default Home;