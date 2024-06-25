import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDevices } from '../api/device';
import UVBOX from '../assets/UVBOX.png';

const DeviceScreen = () => {
  const [deviceList, setDeviceList] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { item, combinedData, userData } = route.params;

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const idUser = userData.id; 
        const devices = await getDevices(token, idUser);
        setDeviceList(devices);
      } catch (error) {
        console.error('Error fetching devices:', error);
        Alert.alert('Error', 'Failed to fetch devices');
      }
    };

    fetchDevices();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('Device detail', { device: item })}>
      <Image source={UVBOX} style={styles.deviceImage} />
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}{item.id} </Text>
        <Text style={styles.deviceDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={deviceList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  deviceImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default DeviceScreen;
