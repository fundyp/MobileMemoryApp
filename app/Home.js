import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps"; // Import Callout from react-native-maps
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
  const { firstName, username } = route.params || {};

  const [locations, setLocations] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [markerId, setMarkerId] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null); // State to track the selected marker

  const handleSignOut = () => {
    navigation.navigate("Login");
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleUsernamePress = () => {
    Alert.alert('Username', username);
  };

  const toggleAdding = () => {
    setIsAdding(!isAdding);
    setFormVisible(false);
  };

  const handleMapPress = (event) => {
    if (!isAdding) {
      // Handle marker selection here
      const selectedMarker = locations.find((location) => (
        location.latitude === event.nativeEvent.coordinate.latitude.toString() &&
        location.longitude === event.nativeEvent.coordinate.longitude.toString()
      ));
      if (selectedMarker) {
        // Show popup when a marker is selected
        Alert.alert('Marker Info', `ID: ${selectedMarker.id}, Title: ${selectedMarker.name}`);
      }
    } else {
      // Handle adding new marker when isAdding is true
      setSelectedCoordinate(event.nativeEvent.coordinate);
      setLatitude(event.nativeEvent.coordinate.latitude.toString());
      setLongitude(event.nativeEvent.coordinate.longitude.toString());
      setFormVisible(true);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post('https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api/locations', {
        title,
        username,
        latitude,
        longitude,
      });

      const { message, markerId } = response.data;
      console.log(message);
      console.log(markerId);
      console.log('Location added:', response.data);

      setMarkerId(markerId);

      // Update locations after adding the new location
      const updatedLocations = await fetchLocations(username);
      setLocations(updatedLocations);

      console.log(locations);
      

      setFormVisible(false);
      setTitle("");
      setLatitude(null);
      setLongitude(null);
      setSelectedCoordinate(null);
    } catch (error) {
      console.error('Error adding location:', error);
      if (error.response) {
        // Handle error
      }
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    setSelectedCoordinate(null);
  };

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker); // Set the selected marker when it's pressed
  };

  const menuItems = [
    { id: 1, title: "Sign Out", onPress: handleSignOut },
    { id: 2, title: "Username", onPress: handleUsernamePress },
  ];

  useEffect(() => {
    const fetchLocationsData = async () => {
      const fetchedLocations = await fetchLocations(username);
      setLocations(fetchedLocations);

      console.log(locations)
    };

    // allows initial fetch data from sign in
    fetchLocationsData();
  }, [username]); // Include markerId in dependencies

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
            key={location.locationName}
            coordinate={{
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }}
            title={location.name}
            
            onPress={() => handleMarkerPress(location)} // Call handleMarkerPress on marker press
          >
            {selectedMarker && selectedMarker._id === location._id && ( // Show callout only for the selected marker
              <Callout>
                <View>
                  <Text>ID: {location.locationName}</Text>
                  <Text>Title: {location.name}</Text>
                </View>
              </Callout>
            )}
          </Marker>
        ))}
        
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
    width: "40%",
    height: "20%",
    backgroundColor: "#ABA2B0",
    borderTopRightRadius: 1,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 12,
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
    borderWidth: 2,
    borderColor: "white",
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
    top: "30%",
    left: "10%",
    width: "80%",
    height: "33%",
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