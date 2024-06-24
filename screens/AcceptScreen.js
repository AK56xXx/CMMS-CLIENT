import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Text, Button, Card, Avatar, List } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAvailableTechnician, editMaintenance, createMaintenance } from '../api/maintenance';

const AcceptScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item, combinedData, client } = route.params;


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateValid, setIsDateValid] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);

  const [notifData, setNotifData] = useState([]);

  useEffect(() => {
    if (isDateValid) {
      const fetchTechnicians = async () => {
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

      fetchTechnicians();
    }
  }, [isDateValid, selectedDate]);

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setShowPicker(false);
      setSelectedDate(date);
      if (date >= new Date()) {
        setIsDateValid(true);
      } else {
        setIsDateValid(false);
        Alert.alert('Invalid Date', 'Please select a valid date.');
      }
    } else {
      setShowPicker(false);
    }
  };

  const handleNext = () => {
    if (isDateValid) {
      const formattedDate = selectedDate.toISOString();
      navigation.navigate('Configure', {
        item: { ...item, mdate: formattedDate }
      });
    } else {
      Alert.alert('Invalid Date', 'Please select a valid date.');
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to submit a maintenance on this date?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Submit cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const updateData = { 
                ...item, 
                userResponse: 'APPROVED', 
                mdate: selectedDate.toISOString(), 
                status: 'IN_PROGRESS',
                technician: { id: selectedTechnicianId } // Add selected technician ID
              };
              const response = await createMaintenance(token, updateData);
             
              // getting the client id from item (maintenance) when navigating to maintenance screen
              // you need to indicate the combinedData that caontain the userData for the navigation to Home screen to work
              navigation.navigate('Home', {
                  combinedData: {userData: client}, // navigate to home screen
             //   userData: item.client, //navigate to maintenance screen 
              });
              
              console.log('Submitted:', response);
            
            } catch (error) {
              console.error('Error submitting maintenance:', error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const handleTechnicianSelect = (id) => {
    setSelectedTechnicianId(id);
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.fname + ' ' + item.lname}
      left={() => <Avatar.Text label={item.fname[0]} />}
      onPress={() => handleTechnicianSelect(item.id)}
      style={item.id === selectedTechnicianId ? styles.selectedItem : null}
    />
  );

  const renderHeader = () => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {!isDateValid && (
          <>
            <Text style={styles.title}>Select a Date</Text>
            <Button onPress={() => setShowPicker(true)} mode="contained" style={styles.datePickerButton}>
              Pick Date
            </Button>
          </>
        )}
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}
        {isDateValid && (
          <>
            <Text style={styles.validText}>Your date is valid</Text>
            <Text style={styles.selectedDate}>{selectedDate.toDateString()}</Text>
            <Text style={styles.title}></Text>
            <Text style={styles.title}>Select a technician</Text>
          </>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={isDateValid ? technicians : []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.container}
      />
      <Button
        mode="contained"
        style={styles.nextButton}
        onPress={handleSubmit}
        disabled={!isDateValid || selectedTechnicianId === null}
      >
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  card: {
    marginVertical: 16,
    padding: 16,
  },
  cardContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  datePickerButton: {
    marginBottom: 16,
  },
  nextButton: {
    marginTop: 16,
  },
  validText: {
    color: 'green',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  selectedDate: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: 'blue',
  },
  submitButton: {
    marginTop: 16,
  },
  selectedItem: {
    backgroundColor: '#d3d3d3', // Change this color as needed
  }
});

export default AcceptScreen;
