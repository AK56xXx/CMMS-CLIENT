import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTicketsByClient } from '../api/ticket';

const TicketScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = route.params;
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const clientId = userData.id; // Assuming clientId is passed via route params
      const ticketsData = await getTicketsByClient(token, clientId);
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      Alert.alert('Error', 'Failed to fetch tickets');
    }
  };

  const renderTicketItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.issue}</Text>
        <Text>{item.other}</Text>

        <Text></Text>
        <Text>Device: {item.device.name}{item.device.id}</Text> 
        <Text style={styles.cardStatus}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={<Text style={styles.ticketListHeader}>Tickets</Text>}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardStatus: {
    marginTop: 8,
    color: '#666',
  },
  ticketListHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
});

export default TicketScreen;
