import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApprovedMaintenances } from '../api/maintenance';

const MaintenanceScreen = () => {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const navigation = useNavigation();

  const route = useRoute();
  const { item, combinedData, userData } = route.params;

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Get token from AsyncStorage or context
        const idUser = userData.id; // Get user id from wherever it's stored
        const maintenances = await getApprovedMaintenances(token, idUser);
        setMaintenanceList(maintenances);
      } catch (error) {
        console.error('Error fetching maintenances:', error);
        Alert.alert('Error', 'Failed to fetch maintenances');
      }
    };

    fetchMaintenances();
  }, []);

  const handleMaintenancePress = (maintenance) => {
    // Navigate to the detail screen with maintenance data
    navigation.navigate('View maintenance details', { maintenance });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleMaintenancePress(item)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={maintenanceList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
  description: {
    fontSize: 16,
    marginTop: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default MaintenanceScreen;
