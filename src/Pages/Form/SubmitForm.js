import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

const Form = () => {
  const [imageUri, setImageUri] = useState('');
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');
  const [takePictureClicked, setTakePictureClicked] = useState(false);

  useEffect(() => {
    // Request camera permission if not granted
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (device == null) return <NoCameraDeviceError />; // if no back camera

  const takePicture = async () => {
    if(cameraRef !== null){
      const photo = await cameraRef.current.takePhoto();
      setImageUri(photo.path);
      setTakePictureClicked(true);
    }
  };
  
  const submitForm = async () => {
    console.log("imageuri ",imageUri);
    try {
      const formData = new FormData();
      formData.append('latitude', '40.712776'); // Example latitude
      formData.append('longitude', '-74.005974'); // Example longitude
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg', // Adjust file type based on your image
        name: 'photo.jpg',
      });

      const response = await axios.post('https://test.webyaparsolutions.com/form', formData, {
        headers: {
          'Authorization': 'Bearer <your_token>',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log("Successful", response.data);
        // Handle success, e.g., show a success message
      }
    } catch (error) {
      console.log("Post failed", error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <View style={styles.container}>
      { takePictureClicked ? (
        <>
          {imageUri !=='' && (
            <View style={styles.imageContainer}>
              <View style={styles.image} >
                <Image source={{uri: 'file://'+imageUri }} style={{flex:1}} />
              </View>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={submitForm}>
              <Text style={styles.buttonText}>Submit Form</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={{flex:1}} >
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true} // Enable photo capture
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius:10
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Form;
