import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios for HTTP requests
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for selecting images
import Constants from 'expo-constants';

const ImagePage = () => {
  const route = useRoute();
  const { markerId, title, username } = route.params;

  const navigation = useNavigation();

  const [images, setImages] = useState([]);

  const handleBack = () => {
    navigation.goBack();
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
    //let filename = localUri.split('/').pop();

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
      <View style={styles.topRow}>
        <Button title="Go Back" onPress={handleBack} />
      </View>
      <Text style={styles.title}>Title: {title}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddImages}>
          <Text style={styles.buttonText}>Add Images</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRemoveImages}>
          <Text style={styles.buttonText}>Remove Images</Text>
        </TouchableOpacity>
      </View>
      {images && images.length > 0 ? (
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image.imageUrl }} style={styles.image} />
          ))}
        </View>
      ) : (
        <Text>No images found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20, // Adjust as needed
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10, // Added marginBottom for spacing
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    margin: 5,
  },
});

export default ImagePage;