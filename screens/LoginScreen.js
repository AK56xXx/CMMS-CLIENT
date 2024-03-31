import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const LoginScreen = () => {
  // State variables to store username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation(); // Initialize navigation hook

  const handleLogin = async () => {
    try {
      // Send POST request using axios
      const response = await axios.post('http://192.168.1.2:8081/login', {
        username,
        password,
      });

      // Extract token from response
      const token = response.data.token;

      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', token);
      console.log('Token stored in AsyncStorage:', token);

      // Handle successful login
      console.log('Login successful!');

      // Call the API GET http://192.168.1.2:8081/demo
      const demoResponse = await axios.get('http://192.168.1.2:8081/demo', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });

      // Replace LoginScreen with DemoScreen upon successful login and pass the response data
        navigation.replace('Home', { demoData: demoResponse.data});
      // (*) better not use Navigation.navigate here because it can goes back to LoginScreen
      // navigation.navigate('Home', { demoData: demoResponse.data }); 

    } catch (error) {
      console.error('Error logging in:', error);
      // Display informative error message
      Alert.alert('Login Failed', error.message || 'Invalid username or password');
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;