import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getAutoNotification, addAutoMaintenance, editMaintenance } from '../api/maintenance';
import { getAnnouncement } from '../api/announcement'; // Import the getAnnouncement function
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import announcement from '../assets/announcement.jpg'; // Import image
import { API_BASE_URL } from '../config';




const DemoScreen = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifData, setNotifData] = useState([]);
  const [announcements, setAnnouncements] = useState([]); // State for announcements
  const navigation = useNavigation();
  const route = useRoute();
  const combinedData = route.params?.combinedData || {};
  const userData = combinedData.userData || {};
  const demoData = combinedData.demoData || {};

  const { id, fname, lname, photo } = userData;

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await addAutoMaintenance(token, userData.id);
        const data = await getAutoNotification(token, userData.id);
        setNotifData(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if(token){
        const data = await getAnnouncement(token);
        setAnnouncements(data);
      }   
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      fetchAnnouncements(); // Fetch announcements when the screen is focused
    }, [])
  );

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/logout`);
      if (response.status === 200) {
        navigation.replace('Login', { screen: 'Login' });
      } else {
        console.error('Logout failed:', response.data);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigateProfile = () => {
    navigation.navigate('Profile', { id, fname, lname });
  };

  const navigateMaintenance = () => {
    navigation.navigate('Maintenance', { userData });
  };

  const navigateDevice = () => {
    navigation.navigate('Device', { userData });
  };

  const navigateTicket = () => {
    navigation.navigate('Ticket', { userData });
  };

  const handleAccept = (item) => {
    navigation.navigate('Configure', { item, client: userData });
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
              const updateData = { ...item, userResponse: 'REJECTED' };
              const response = await editMaintenance(token, updateData);
              console.log('Declined:', response);
              setNotifData((prevData) => prevData.filter((notif) => notif.id !== item.id));
            } catch (error) {
              console.error('Error declining maintenance:', error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const renderNotificationItem = ({ item }) => (
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

  const renderAnnouncementItem = ({ item }) => (
    <View style={styles.announcementItem}>
      <Image
        source={announcement} // Placeholder image from assets
        style={styles.announcementImage}
      />
      <View style={styles.announcementTextContainer}>
        <Text style={styles.announcementTitle}>{item.title}</Text>
        <Text style={styles.announcementContent}>{item.content}</Text>
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
              source={{ uri: /*photo*/ userData.photo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{fname} {lname}</Text>
          </View>
          <TouchableOpacity style={styles.menuItem} onPress={navigateProfile}>
            <Icon name="person" size={20} color="black" />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={navigateDevice}>
            <Icon name="hardware-chip" size={20} color="black" />
            <Text style={styles.menuItemText}>Devices</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={navigateMaintenance}>
            <Icon name="build" size={20} color="black" />
            <Text style={styles.menuItemText}>Maintenances</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={navigateTicket}>
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
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <FlatList
              data={announcements}
              renderItem={renderAnnouncementItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
            />
          )}
        />
      </View>
    </View>
  );
};

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
  announcementItem: {
    flexDirection: 'row',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  announcementImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 20,
  },
  announcementTextContainer: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  announcementContent: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
});

export default DemoScreen;
