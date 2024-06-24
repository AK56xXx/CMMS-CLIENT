import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getAutoNotification, addAutoMaintenance, editMaintenance } from '../api/maintenance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUser } from '../api/client';



const Menu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const token = AsyncStorage.getItem('token');
    const user = getUser(token);

    const navigation = useNavigation();



    const navigateProfile = () => {
        navigation.navigate('Profile', { user : {id: id},  user : {fname: user.fname}, user : {lname: user.lname} });
      };
    
      const navigateMaintenance = () => {
        navigation.navigate('Maintenance', { user });
      };
    
      const navigateDevice = () => {
        navigation.navigate('Device', { user });
      };
    
      const navigateTicket = () => {
        navigation.navigate('Ticket', { user });
      };

      const handleLogout = async () => {
        try {
          const response = await axios.get('http://192.168.1.2:8081/logout');
          if (response.status === 200) {
            navigation.replace('Login', { screen: 'Login' });
          } else {
            console.error('Logout failed:', response.data);
          }
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };



    const toggleMenu = ()  => {



        setMenuOpen(!menuOpen);
      };

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
              source={{ uri:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{user.fname} {user.lname}</Text>
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
  });

export default Menu;