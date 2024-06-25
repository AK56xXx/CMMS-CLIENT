import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image, Text } from 'react-native';
import { TextInput, Button, Title, ActivityIndicator, Colors } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import pura from '../assets/pura.jpeg'; // Import image
import { API_BASE_URL } from '../config';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      console.log('Token stored in AsyncStorage:', token);

      const userDataResponse = await axios.get(`${API_BASE_URL}/api/v1/users/token/${token}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = userDataResponse.data;
      const demoResponse = await axios.get(`${API_BASE_URL}/app/demo`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const combinedData = { userData, demoData: demoResponse.data };
      navigation.replace('Home', { combinedData, token });
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

     
      <Image
        source={pura} // Use the imported image
        style={styles.pura}
      />
    
      <Title style={styles.title}>Login</Title>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        {loading ? <ActivityIndicator color /> : 'Login'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },

  pura: {
    width: 350, // Adjust width and height as needed
    height: 350,
    resizeMode: 'contain', // Maintain aspect ratio
    marginBottom: 100, // Adjust margin as needed
    marginLeft: 75,
  },
});

export default LoginScreen;
