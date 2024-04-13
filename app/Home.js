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
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} onPress={item.onPress}>
              <Text style={styles.menuItem}>{item.title}</Text>
            </TouchableOpacity>
          ))}
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => console.log("Add pressed")}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log("Edit pressed")}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#130F15",
  },
  actionBar: {
    backgroundColor: "#331E3E",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  dropdown: {
    position: "absolute",
    top: 54,
    left: 0,
    width: "40%", // Adjust the width as needed
    height: "20%", // Half of the screen height
    backgroundColor: "#ABA2B0",
    borderTopRightRadius: 1, // Sharper top right corner
    borderBottomRightRadius: 12, // Sharper bottom right corner
    borderTopLeftRadius: 1, // Rounded top left corner
    borderBottomLeftRadius: 12, // Rounded bottom left corner
    elevation: 3,
    zIndex: 1000,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#A66CC3",
    borderRadius: 6,
    paddingHorizontal: 60,
    paddingVertical: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    flex: 0.8,
    marginHorizontal: 5,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  signOutButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  signOutText: {
    color: "#A66CC3",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default Home;