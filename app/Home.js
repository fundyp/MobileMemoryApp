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
    // Add more menu items here if need be
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
        <View style={styles.header}>
          <Text style={styles.headerText}>{firstName}'s Memory Map</Text>
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
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  dropdown: {
    position: "absolute",
    top: 50,
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
  header: {
    alignItems: "center",
    marginVertical: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionBarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  map: {
    flex: 0.7,
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default Home;