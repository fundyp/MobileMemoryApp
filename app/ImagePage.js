import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Platform, ScrollView, Modal, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios for HTTP requests
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for selecting images
import Constants from 'expo-constants';
import ActionBar from './ActionBar';

const ImagePage = () => {
  const route = useRoute();
  const { markerId, title, username, firstName } = route.params;

  const navigation = useNavigation();

  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State to track selected image
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedIndex, setSelectedIndex] = useState(0); // State to track selected image index

  // this is more of a boolean than anything else, will be true when remove button is toggled
  const [removeImages, setRemoveImages] = useState(false);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  
  const handleBack = () => {
    navigation.goBack();
  };

  const handlePreviousImage = () => {
    setSelectedImage(images[selectedIndex === 0 ? images.length - 1 : selectedIndex - 1]?.imageUrl);
    setSelectedIndex(prevIndex => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  };
  
  const handleNextImage = () => {
    setSelectedImage(images[(selectedIndex + 1) % images.length]?.imageUrl);
    setSelectedIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(`https://cop4331-g6-lp-c6d624829cab.herokuapp.com/posts/${username}/${markerId}`);
      const data = await response.json();
      setImages(data); // Assuming data is an array of image objects with an 'imageUrl' property
      //setImages(response.data); // Assuming data is an array of image objects with an 'imageUrl' property

      
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleAddImages = async () => {
    // Check permissions for accessing camera roll
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      //console.log('Permission status:', status);

      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    // Select images from camera roll
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log('Selected image:', result);
    //console.log('Selected image type:', result.assets[0].type);

    if (!result.cancelled) {
      let localUri = result.assets[0].uri;
      let filename = 'image.jpg'; // Default filename if localUri is undefined or null

      if (localUri) {
        let uriParts = localUri.split('/');
        filename = uriParts.pop();
      }
      console.log('filename is: ',filename);

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      // Upload the selected image(s) to the server
      const formData = new FormData();
      formData.append('image', {uri: result.assets[0].uri, type: result.assets[0].type, name: filename});
      formData.append('caption', 'Image caption'); // Add caption if needed
      formData.append('username', username);
      formData.append('locationId', markerId);

      try {
        const response = await axios.post('https://cop4331-g6-lp-c6d624829cab.herokuapp.com/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Refresh images after upload
        fetchImages();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleRemoveButton = async () => {
    setRemoveImages(!removeImages);
  };

  useEffect(() => {
    // Reset selectedToRemove when removeImages is set to false
    if (!removeImages) {
      setSelectedToRemove([]);
    }
  }, [removeImages]);

  // connects to endpoint and deletes one image at a time
  const deleteOnePic = async (imageId) => {
    try {
      const response = await axios.delete(`https://cop4331-g6-lp-c6d624829cab.herokuapp.com/posts/${imageId}`);
      
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleRemoveImages = async () => {
    try {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete the selected images?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              
              for (const image of selectedToRemove) {
                await deleteOnePic(image._id);
              }
              setSelectedToRemove([]);
              fetchImages();
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [markerId]); // Fetch images when markerId changes

  return (
    <View style={styles.container}>
      <ActionBar title={`${firstName}'s Memory Map`} onMenuPress={handleBack} />
      
      <Text style={styles.title}>{title}</Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, removeImages ? styles.deleteButton : null]}
        onPress={removeImages ? handleRemoveImages : handleAddImages}
      >
        <Text style={styles.buttonText}>{removeImages ? 'Delete' : 'Add Images'}</Text>
      </TouchableOpacity>

        
        <TouchableOpacity
          style={[styles.button, removeImages && styles.activeButton]} // Apply active style when removeImages is true
          onPress={handleRemoveButton} // Always call handleRemoveImages when "Remove Images" button is pressed
        >
          <Text style={styles.buttonText}>Remove Images</Text>
        </TouchableOpacity>
      </View>


      <ScrollView contentContainerStyle={styles.imageContainer}>
        <View style={styles.imageRow}>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => {
                if(removeImages) {
                  if(selectedToRemove.includes(image)) {
                    setSelectedToRemove(selectedToRemove.filter(item => item !== image));
                  } else {
                    setSelectedToRemove([...selectedToRemove, image]);
                  }
                }
                else {
                  setSelectedImage(image.imageUrl);
                  setSelectedIndex(index);
                  setModalVisible(true);
                }
              }}>
                <Image source={{ uri: image.imageUrl }} 
                style={[styles.image, selectedToRemove.includes(image) && styles.grayedImage]} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: 'white' }}>No Images :C</Text>
          )}
        </View>
      </ScrollView>

      {/* Modal for displaying enlarged image */}
      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.leftButton} onPress={handlePreviousImage}>
            <Text style={styles.buttonText}>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightButton} onPress={handleNextImage}>
            <Text style={styles.buttonText}>{">"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image source={{ uri: images[selectedIndex]?.imageUrl }} style={styles.modalImage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#130F15', 
    alignItems: 'center',
    paddingTop: 0, 
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10, // Added marginBottom for spacing
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#A66CC3',
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    paddingTop: 15,
    width: 160,
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center', // Center images vertically
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: 208,
    height: 180,
    margin: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: '5%', 
    right: '5%',
    backgroundColor: '#A66CC3',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  leftButton: {
    position: 'absolute',
    top: '50%', 
    left: '2%', 
    backgroundColor: '#A66CC3',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rightButton: {
    position: 'absolute',
    top: '50%', 
    right: '2%', 
    backgroundColor: '#A66CC3',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  activeButton: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    paddingTop: 15,
    width: 160,
    height: 50,
  },
  activeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1, // Ensure the delete button is above the add button
    backgroundColor: 'red', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#800D3B',
    
  },

  grayedImage: {
    width: 208,
    height: 180,
    margin: 2,
    opacity: 0.1, // Adjust opacity to control the level of grayness
  },

  grayOut: {
    tintColor: '#808080'
  }
  
});

export default ImagePage;