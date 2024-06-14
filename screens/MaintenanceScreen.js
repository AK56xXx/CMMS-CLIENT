import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApprovedMaintenances } from '../api/maintenance';

const MaintenanceScreen = () => {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = route.params || {};



  useEffect(() => {
    const fetchMaintenances = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const idUser = userData.id;
          const maintenances = await getApprovedMaintenances(token, idUser);
          setMaintenanceList(maintenances);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching maintenances:', error);
          Alert.alert('Error', 'Failed to fetch maintenances');
          setLoading(false);
        }
   
    };

    fetchMaintenances();
  }, []);

  const handleMaintenancePress = (maintenance) => {
    navigation.navigate('View maintenance details', { maintenance });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleMaintenancePress(item)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  
  return (
    <View style={styles.container}>

      <View style={styles.header}>

        
       
      </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
