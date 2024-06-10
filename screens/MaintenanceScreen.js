import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Text, Button, Card, Avatar, List } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAvailableTechnician } from '../api/maintenance';
import { editMaintenance } from '../api/maintenance';

const MaintenanceScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateValid, setIsDateValid] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [technicians, setTechnicians] = useState([]);
/*
    useEffect(() => {

      const fetchMaintennances = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            const techData = await getAvailableTechnician(token, selectedDate);
            console.log(techData);
            setTechnicians(techData);
          } else {
            Alert.alert('Error', 'User not authenticated');
          }
        } catch (error) {
          console.error('Error fetching technicians:', error);
          Alert.alert('Error', 'Error fetching technicians');
        }
      };

      fetchMaintennances();
    
    });
*/
  return (
    <View style={styles.container}>
    
    
  </View>

)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
});

export default MaintenanceScreen;
