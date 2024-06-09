import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Button, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation hook
import { getAutoNotification, addAutoMaintenance, editMaintenance } from '../api/maintenance';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Icon from 'react-native-vector-icons/Ionicons'; // Import vector icons


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

  // Add & fetch auto notif
  useEffect(() => {
    const addMaintenanceAndFetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await addAutoMaintenance(token, id);
          const data = await getAutoNotification(token, id);
          setNotifData(data);
        }
      } catch (error) {
        console.error('Error adding maintenance or fetching notifications:', error);
      }
    };

    addMaintenanceAndFetchNotifications();
  }, [id]);


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
        // Navigate to LoginScreen
        navigation.replace('Login', { screen: 'Login' });
      } else {
        console.error('Logout failed:', response.data);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  
  // navigate to profileScreen with the data of the user
  const navigateProfile = () => {
    navigation.navigate('Profile', {
      user: userData,
    });
  };

  const handleAccept = (item) => {
    // Implement accept logic here
    console.log('Accepted:', item);
  };

  const handleDecline = async (item) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to decline this maintenance?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Decline cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const updateData = { ...item, userResponse: 'REJECTED' }; // Update the object with the new status
              const response = await editMaintenance(token, updateData);
              console.log('Declined:', response);
              // Optionally, update the local state to reflect the declined status
              setNotifData((prevData) =>
                prevData.filter((notif) => notif.id !== item.id)
              );
            } catch (error) {
              console.error('Error declining maintenance:', error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item)}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineButton} onPress={() => handleDecline(item)}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Icon name={menuOpen ? 'close' : 'menu'} size={24} color="blue" />
        </TouchableOpacity>
        <Text style={styles.title}>Pura Overview</Text>
      </View>

      {menuOpen && (
        <View style={styles.menu}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} // Replace with the actual profile image URL
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{fname} {lname}</Text>
          </View>
          <TouchableOpacity style={styles.menuItem} onPress={navigateProfile}>
            <Icon name="person" size={20} color="black" />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="hardware-chip" size={20} color="black" />
            <Text style={styles.menuItemText}>Devices</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="build" size={20} color="black" />
            <Text style={styles.menuItemText}>Maintenances</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="ticket" size={20} color="black" />
            <Text style={styles.menuItemText}>Open tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Icon name="log-out" size={20} color="black" />
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <FlatList
          data={notifData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
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
  menu: {
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    marginLeft: 10,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DemoScreen;
