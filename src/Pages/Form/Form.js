import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

const Form = ({ route }) => {
  const { token } = route.params;

  const [imageUri, setImageUri] = useState('');
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');
  const [takePictureClicked, setTakePictureClicked] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  console.log("token: ",token);

  if (device == null) return <NoCameraDeviceError />;

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current.takePhoto({ quality: 'high', base64: false });
      setImageUri(photo.path);
      setTakePictureClicked(true);
      console.log('Image captured:', photo.path);
    } catch (error) {
      console.log('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const submitForm = async () => {
    try {
      if (!imageUri) {
        throw new Error('Image URI is empty');
      }

      const formData = new FormData();
      formData.append('latitude', '40.712776');
      formData.append('longitude', '-74.005974'); 
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await axios.post('https://test.webyaparsolutions.com/form', formData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);

      if (response.status === 200) {
        console.log('Successful');
        // Optionally, show a success message or navigate to another screen
      }
    } catch (error) {
      console.log('Post failed', error);
    }
  };

  return (
    <View style={styles.container}>
      { takePictureClicked ? (
        <>
          {imageUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: 'file://' + imageUri }} style={styles.image} />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={submitForm}>
              <Text style={styles.buttonText}>Submit Form</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
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
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
});

export default Form;
