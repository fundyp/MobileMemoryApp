import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Platform, ScrollView, Modal } from 'react-native';
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

      //console.log('the fetch images response is: ', data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleAddImages = async () => {
    // Check permissions for accessing camera roll
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);

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

    console.log('Selected image:', result);
    console.log('Selected image type:', result.assets[0].type);

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

      console.log();
      console.log('formData info:', formData);
      console.log('formData Image information:', formData.image);

      try {
        const response = await axios.post('https://cop4331-g6-lp-c6d624829cab.herokuapp.com/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        //console.log(); // new line
        //console.log('Upload response:', response.data);
        // Refresh images after upload
        fetchImages();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleRemoveImages = async () => {
    // Implement the logic to remove images
  };

  useEffect(() => {
    fetchImages();
  }, [markerId]); // Fetch images when markerId changes

  return (
    <View style={styles.container}>
      <ActionBar title={`${firstName}'s Memory Map`} onMenuPress={handleBack} />
      
      <Text style={styles.title}>{title}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddImages}>
          <Text style={styles.buttonText}>Add Images</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRemoveImages}>
          <Text style={styles.buttonText}>Remove Images</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.imageContainer}>
        <View style={styles.imageRow}>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => {
                setSelectedImage(image.imageUrl);
                setSelectedIndex(index);
                setModalVisible(true);
              }}>
                <Image source={{ uri: image.imageUrl }} style={styles.image} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: 'white' }}>No images found.</Text>
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
    paddingTop: 0, // Adjust as needed
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    top: '5%', // Adjust as needed, e.g., '10%', '15%', etc.
    right: '5%', // Adjust as needed, e.g., '10%', '15%', etc.
    backgroundColor: '#A66CC3',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  leftButton: {
    position: 'absolute',
    top: '50%', // Adjust as needed, e.g., '40%', '45%', etc.
    left: '2%', // Adjust as needed, e.g., '10%', '15%', etc.
    backgroundColor: '#A66CC3',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rightButton: {
    position: 'absolute',
    top: '50%', // Adjust as needed, e.g., '40%', '45%', etc.
    right: '2%', // Adjust as needed, e.g., '10%', '15%', etc.
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
  
});

export default ImagePage;