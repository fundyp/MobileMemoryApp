import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from 'axios';

const fetchLocations = async (username) => {
  try {
    const response = await axios.get(`https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api/locations/${username}`);
    return response.data; // Assuming the response contains an array of locations
  } catch (error) {
    console.error('Error fetching locations:', error);
    return []; // Return an empty array in case of an error
  }
};

const Home = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { firstName } = route.params || {};

  const [locations, setLocations] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // Track if "Add" button is toggled on
  const [selectedCoordinate, setSelectedCoordinate] = useState(null); // Track selected coordinates
  const [formVisible, setFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [username, setUsername] = useState('');

  const handleSignOut = () => {
    navigation.navigate("Login");
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleAdding = () => {
    setIsAdding(!isAdding);
    setFormVisible(false); // Hide the form when toggling off "Add" button
  };

  const handleMapPress = (event) => {
    if (isAdding) {
      setSelectedCoordinate(event.nativeEvent.coordinate);
      setLatitude(event.nativeEvent.coordinate.latitude.toString());
      setLongitude(event.nativeEvent.coordinate.longitude.toString());
      setFormVisible(true); // Show the form when a spot is clicked
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post('https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api/locations', {
        title,
        username, // Assuming you have stored the username somewhere accessible
        latitude,
        longitude,
      });
      console.log('Location added:', response.data);
      // Add any additional logic after successfully adding the location
      setFormVisible(false); // Hide the form after confirmation
      setTitle(""); // Clear the form fields
      setLatitude(null);
      setLongitude(null);
      setSelectedCoordinate(null);
    } catch (error) {
      console.error('Error adding location:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error setting up the request:', error.message);
      }
    }
  };
  const handleCancel = () => {
    // Remove the selected coordinate and close the form
    setFormVisible(false);
    setSelectedCoordinate(null);
  };

  const menuItems = [
    { id: 1, title: "Sign Out", onPress: handleSignOut },
    // Add more menu items here if needed
  ];

  useEffect(() => {
    const fetchLocationsData = async () => {
      const fetchedLocations = await fetchLocations(firstName); // Assuming firstName is the username
      setLocations(fetchedLocations);
    };

    const fetchUsername = async () => {
      try {
        const response = await axios.get('https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api/login');
        setUsername(response.data.username); // Assuming the username is in the response data
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchLocationsData();
    fetchUsername();
  }, [firstName]);

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
        onPress={handleMapPress}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }}
            title={location.name}
            description={location.description}
          />
        ))}
        {selectedCoordinate && (
          <Marker
            coordinate={selectedCoordinate}
            title="Selected Location"
            description={`Latitude: ${latitude}, Longitude: ${longitude}`}
          />
        )}
      </MapView>
      {formVisible && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Creating New Memory...</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={latitude}
            onChangeText={(text) => setLatitude(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={longitude}
            onChangeText={(text) => setLongitude(text)}
          />
          <View style={styles.formButtonContainer}>
            <TouchableOpacity style={styles.formButton} onPress={handleConfirm}>
              <Text style={styles.formButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.formButton} onPress={handleCancel}>
              <Text style={styles.formButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isAdding ? styles.buttonActive : null]}
          onPress={toggleAdding}
        >
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
  buttonActive: {
    borderWidth: 2, // Add border when button is active (toggled on)
    borderColor: "white", // Border color for the glow effect
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
  formContainer: {
    position: "absolute",
    top: "30%", // Adjust top position as needed
    left: "10%", // Adjust left position as needed
    width: "80%", // Adjust width as needed
    height: "33%", // 1/3 of the screen height
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
    zIndex: 1000,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  formButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formButton: {
    backgroundColor: "#A66CC3",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  formButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;