import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Pressable } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://test.webyaparsolutions.com/auth/user/login', {
        email,
        password,
      });


      console.log('Login successful:', response.data);
      navigation.navigate('Form',  { token: response.data.token })
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, { color: 'black' }]} 
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[styles.input, { color: 'black' }]} 
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor={"#ccc"}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: 'black' }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={{flexDirection:"row", justifyContent:"center", marginTop:10}} >
        <Text style={{color:"#000", fontWeight:"bold"}} >New User?</Text>
        <Pressable onPress={()=>navigation.navigate('Signup')} ><Text style={{color:"blue", fontWeight:"bold"}} > SignUp</Text></Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 5,
    color:"#000",
    fontWeight:"bold",
    marginLeft:8
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color:"#000",
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Login;
