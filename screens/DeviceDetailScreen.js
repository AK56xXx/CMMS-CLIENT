import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, TextInput, Button, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addTicket, getTickets, updateTicket, delTicket } from '../api/ticket';
import { getProblems } from '../api/problem';
import { Ionicons } from '@expo/vector-icons';

const DeviceDetailScreen = () => {
  const route = useRoute();
  const { device } = route.params;
  const [problems, setProblems] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [description, setDescription] = useState('');
  const [editingTicket, setEditingTicket] = useState(null);

  useEffect(() => {
    fetchProblems();
    fetchTickets();
  }, []);

  const fetchProblems = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const problemsData = await getProblems(token);
      setProblems(problemsData);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const ticketsData = await getTickets(token, device.id);
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleAddTicket = async () => {
    if (!selectedProblem || !description) {
      Alert.alert('Error', 'Please select a problem and enter a description.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const ticketData = {
        issue: selectedProblem.name,
        other: description,
        device: { id: device.id },
        client: { id: device.client.id },
        status: 'OPEN',
      };

      if (editingTicket) {
        ticketData.id = editingTicket.id;
        await updateTicket(token, ticketData);
        Alert.alert('Success', 'Ticket updated successfully.');
      } else {
        await addTicket(token, ticketData);
        Alert.alert('Success', 'Ticket added successfully.');
      }

      fetchTickets();
      setModalVisible(false);
      setSelectedProblem(null);
      setDescription('');
      setEditingTicket(null);
    } catch (error) {
      console.error('Error adding/updating ticket:', error);
    }
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setSelectedProblem(problems.find(problem => problem.name === ticket.issue));
    setDescription(ticket.other);
    setModalVisible(true);
  };

  const handleRemoveTicket = async (ticketId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await delTicket(token, ticketId);
      fetchTickets();
      Alert.alert('Success', 'Ticket removed successfully.');
    } catch (error) {
      console.error('Error removing ticket:', error);
    }
  };

  const renderProblemItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.problemItem, selectedProblem?.id === item.id && styles.selectedProblem]}
      onPress={() => setSelectedProblem(item)}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTicketItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleEditTicket(item)}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.issue}</Text>
        <Text>{item.other}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEditTicket(item)}>
            <Ionicons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveTicket(item.id)}>
            <Ionicons name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: /*device.imageUrl*/ "https://www.tsm-int.com/wp-content/uploads/2020/07/UVBOX.png" }} style={styles.deviceImage} />
      <Text style={styles.deviceName}>{device.name}{device.id}</Text>
      <Text style={styles.deviceDescription}>{device.description}</Text>
      <Text>Serial: {device.serial}</Text>
      <Text>Description: {device.description}</Text>
      <Text>IP Address: {device.ipAddress}</Text>
      <Text>MAC Address: {device.macAddress}</Text>
      <Text>Purchase Date: {device.purchaseDate}</Text>
      <Text>Repair Number: {device.repair_nbr}</Text>
      <Text>End of Service Date: {device.eosdate}</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Ticket</Text>
      </TouchableOpacity>

      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={<Text style={styles.ticketListHeader}>Tickets</Text>}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={problems}
              renderItem={renderProblemItem}
              keyExtractor={item => item.id.toString()}
              ListHeaderComponent={<Text style={styles.modalHeader}>Select a Problem</Text>}
            />
            <TextInput
              style={styles.descriptionInput}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddTicket}>
              <Text style={styles.submitButtonText}>Submit Ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => {
              setModalVisible(false);
              setSelectedProblem(null);
              setDescription('');
              setEditingTicket(null);
            }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    alignItems: 'center',
  },
  deviceImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  addButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  problemItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  selectedProblem: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  descriptionInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
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
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
  },
  removeButton: {
    backgroundColor: '#d9534f',
    padding: 8,
    borderRadius: 4,
  },
  ticketListHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
});

export default DeviceDetailScreen;
