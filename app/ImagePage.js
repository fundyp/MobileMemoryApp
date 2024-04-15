import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios for HTTP requests

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

      console.log('the fetch images response is: ', data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleAddImages = async () => {
    
  };

  const handleRemoveImages = async () => {
    // Implement the logic to remove images
  };

  useEffect(() => {
    fetchImages();
}, [markerId]); // Fetch images when markerId changes

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title: {title}</Text>
      {images && images.length > 0 ? (
  images.map((image, index) => (
    <Image key={index} source={{ uri: image.imageUrl }} style={styles.image} />
  ))
) : (
  <Text>No images found.</Text>
)}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddImages}>
          <Text style={styles.buttonText}>Add Images</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRemoveImages}>
          <Text style={styles.buttonText}>Remove Images</Text>
        </TouchableOpacity>
      </View>
      <Button title="Go Back" onPress={handleBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20, // Adjust as needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
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
});

export default ImagePage;