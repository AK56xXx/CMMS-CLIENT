import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook






const DemoScreen = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation(); // Initialize navigation hook

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  const handleLogout = async () => {
    try {
  
      
  
      // Call the logout API
      const response = await axios.get('http://192.168.1.2:8081/logout');
  
      // Handle API response (e.g., check for success)
      if (response.status === 200) {
        // Clear any stored user data or tokens
        // ...
  
        // Navigate to LoginScreen
        navigation.replace('Login', { screen: 'Login' });
      } else {
        // Handle logout failure
        // ...
        console.error('Logout failed:', response.data);
      }
    } catch (error) {
      // Handle network or API errors
      console.error('Logout failed:', error);
      // ...
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.menuButton}>{menuOpen ? 'Close Menu' : 'Open Menu'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Welcome to My App</Text>
      </View>

      {menuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text>Menu Item 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text>Menu Item 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text onPress={handleLogout}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <Text>This is the content of the app.</Text>
      </View>
    </View>
  );
};

// Set navigation options to disable going back
DemoScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: () => null,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    fontSize: 16,
    color: 'blue',
  },
  menu: {
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default DemoScreen;