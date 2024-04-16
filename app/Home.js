import React, { useState, useEffect } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps"; // Import Marker from react-native-maps
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
  const [formTwoVisible, setFormTwoVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [markerId, setMarkerId] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null); // State to track the selected marker

  const [modalOneVisible, setModalOneVisible] = useState(false);
  const [modalTwoVisible, setModalTwoVisible] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [isMoving, setIsMoving] = useState(false);

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
    setIsEditing(false);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setIsAdding(false);

  };

  // handles all map presses including map right after add button and edit button
  // are selected
  const handleMapPress = (event) => {


    if (!isAdding && !isMoving) {
      // Handle marker selection here
      const selectedMarker = locations.find((location) => (
        location.latitude === event.nativeEvent.coordinate.latitude.toString() &&
        location.longitude === event.nativeEvent.coordinate.longitude.toString()
      ));

      
      
    } else {
      // Handle adding new marker when isAdding is true
      setSelectedCoordinate(event.nativeEvent.coordinate);
      setLatitude(event.nativeEvent.coordinate.latitude.toString());
      setLongitude(event.nativeEvent.coordinate.longitude.toString());

      if(isMoving){
        
          setSelectedMarker(selectedMarker);
          setFormTwoVisible(true);
          setTitle(selectedMarker.title); // Set the title of the marker
        
        //setFormTwoVisible(true);
      }
      else{
        setFormVisible(true);
      }

    
    }
  };


  // the confirm for moveing marker
  const handleMoveConfirm = async () => {
    try {
      const response = await axios.put(`https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api/locations/${selectedMarker._id}`, {
        latitude, // Assuming latitude and longitude are already set in state
        longitude,
      });
  
      console.log(response.data); // Log the response from the server
  
      // Update the selected marker's coordinates in the locations state
      const updatedLocations = locations.map((location) => {
        if (location._id === selectedMarker._id) {
          return { ...location, latitude, longitude };
        }
        return location;
      });
      setLocations(updatedLocations);
  
      setFormTwoVisible(false); // Hide the form after successful update
    } catch (error) {
      console.error('Error updating location:', error);
      // Handle the error accordingly
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
    setFormTwoVisible(false); 
    setIsMoving(false);
    setSelectedCoordinate(null);
  };

  // called in handleMarkerPress -> CustomModalTwo 
  const handleMoveMarker = () => {
    setModalTwoVisible(false);
    setIsMoving(true);
  }

  // called in handleMarkerPress -> CustomModalTwo
  const handleDeleteMarker = () => {
    console.log('delete marker is being called');

    try {
      Alert.alert(
        'Are you sure you want to delete this memory?', // Title
        '', // Message (empty in this case)
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              // reach delete marker endpoint
              // Assuming selectedMarker._id contains the id of the location to delete
              let tempLocationId = selectedMarker._id;

              fetch(`https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api/locations/${tempLocationId}`, {
                method: 'DELETE',
              })
              .then(response => response.text())
              .then(async message => {
                console.log(message);

                // Fetch the updated locations after the DELETE request has completed
                let fetchedLocations = await fetchLocations(username);
                setLocations(fetchedLocations);

                // cleaner look to remove the modal from view
                setModalTwoVisible(false);
              })
              .catch(error => console.error('An error occurred:', error));
            },
                        style: 'destructive',
          },
        ],
        { cancelable: false }
      );
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleMarkerPress = (marker) => {
    // if we are moving we dont want to select another pin
    if (isMoving) {
      return;
    }
    // Check if the add button is not toggled
    if(isEditing) {
      setSelectedMarker(marker);
      setModalTwoVisible(true);
    }
    if (!isAdding && !isEditing) {
      console.log(marker.title);
      console.log(marker._id);
      setSelectedMarker(marker); // Set the selected marker
      setModalOneVisible(true); // Show the modal
    }
  };

  const handleImagesButton = () => {
    // Handle Images button press
    navigation.navigate('ImagePage', {
      markerId: selectedMarker._id,
      title: selectedMarker.title,
      username: username,
      firstName: firstName,
    });
    console.log("Images button pressed");
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
  }, [username]); 

  const CustomModal = ({ visible, onClose, latitude, longitude, title }) => (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          
          <Text>Title: {title}</Text>
          <Text>Latitude: {latitude}</Text>
          <Text>Longitude: {longitude}</Text>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleImagesButton}>
              <Text style={styles.modalButtonText}>Images</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const CustomModalTwo = ({ visible, onClose, latitude, longitude, title }) => (
    <Modal visible={visible} transparent animationType="fade">
      

      <View style={styles.modalContainer}>

      <TouchableOpacity style={styles.modalTwoBackButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>x</Text>
      </TouchableOpacity>

        <View style={styles.modalContent}>
          
          <Text>Title: {title}</Text>
          <Text>Latitude: {latitude}</Text>
          <Text>Longitude: {longitude}</Text>

          <View style={styles.modalTwoButtonContainer}>
            <TouchableOpacity style={styles.modalTwoDeleteButton} onPress={handleDeleteMarker}>
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalTwoMoveButton} onPress={handleMoveMarker}>
              <Text style={styles.modalButtonText}>Move</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
            key={location._id}
            coordinate={{
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }}
            onPress={() => handleMarkerPress(location)} // Call handleMarkerPress on marker press
          />
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

      {formTwoVisible && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Moving Marker...</Text>
          <TextInput
            style={styles.input}
            placeholder="Title 2"
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
            <TouchableOpacity style={styles.formButton} onPress={handleMoveConfirm}>
              <Text style={styles.formButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.formButton} onPress={handleCancel}>
              <Text style={styles.formButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isAdding ? styles.buttonActive : null]}
          onPress={toggleAdding}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isEditing ? styles.buttonActive : null]} 
          onPress= {toggleEditing}
          >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      <CustomModal
        visible={modalOneVisible}
        onClose={() => setModalOneVisible(false)}
        latitude={selectedMarker?.latitude}
        longitude={selectedMarker?.longitude}
        title={selectedMarker?.title}
      />
      <CustomModalTwo
        visible={modalTwoVisible}
        onClose={() => setModalTwoVisible(false)}
        latitude={selectedMarker?.latitude}
        longitude={selectedMarker?.longitude}
        title={selectedMarker?.title}
      />
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: "#A66CC3",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },


  modalTwoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTwoContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTwoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTwoContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  modalTwoButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalTwoDeleteButton: {
    backgroundColor: '#800D3B',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalTwoMoveButton: {
    backgroundColor: '#1F609C',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalTwoBackButton: { 
    backgroundColor: '#A66CC3',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalTwoButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Home;