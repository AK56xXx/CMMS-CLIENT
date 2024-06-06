import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation hook
import { getAutoNotification } from '../api/maintenance';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage






const DemoScreen = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation(); // Initialize navigation hook
  const [notifData, setNotifData] = useState([]);

  const route = useRoute(); // Access route parameters

  //user and token data
  const { combinedData } = route.params;
  const { userData, demoData } = combinedData;

  // Destructure first_name, last_name, and id from demoData
  const { id, fname, lname } = userData;
 // const demoData = route.params.demoData; // Get demoData from route params

// const token = demoData.token;



 useEffect(() => {
  const fetchData = async () => {
    const token = await AsyncStorage.getItem('token');
    const data = await getAutoNotification(token, id);
    setNotifData(data);
  };

  fetchData();
}, [id]);

const renderItem = ({ item }) => (
  <View style={styles.item}>
    <Text>{item.id}</Text>
    <Text>{item.title}</Text>
    <Text>{item.description}</Text>
  </View>
);




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

  // pass the user data to ProfileScreen
  const navigateProfile = () => {
    navigation.navigate('Profile', {
      id,
      fname,
      lname});
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.menuButton}>{menuOpen ? 'Close Menu' : 'Open Menu'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pura Overview</Text>
      </View>

      {menuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text onPress={navigateProfile}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text>Devices</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text>Maintenances</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text>Open tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text onPress={handleLogout}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <Text>This is the content of the app.</Text>
        <Text>Data from demo endpoint: {JSON.stringify(demoData)}</Text>
        <FlatList
          data={notifData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Adjust keyExtractor based on your data structure
        />
      </View>

      <View style={styles.content}>
        <Text>This is the content of the app.</Text>
         {/* Display user details */}
        <Text>User ID: {id}</Text>
        <Text>First Name: {fname}</Text>
        <Text>Last Name: {lname}</Text>
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