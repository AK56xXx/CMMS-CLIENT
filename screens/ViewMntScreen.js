import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, RadioButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMaintenanceById } from '../api/maintenance';
import { addFeedback, updateFeedback, getFeedbackByMaintenanceId } from '../api/feedback';

const ViewMntScreen = () => {
  const route = useRoute();
  const { maintenance } = route.params;
  const [maintenanceDetail, setMaintenanceDetail] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [satisfaction, setSatisfaction] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState('');
  const [feedbackId, setFeedbackId] = useState(null);

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const maintenanceData = await getMaintenanceById(token, maintenance.id);
        setMaintenanceDetail(maintenanceData);
        const feedbackData = await getFeedbackByMaintenanceId(token, maintenance.id);
        if (feedbackData) {
          setSatisfaction(feedbackData.subject);
          setSubmittedFeedback(feedbackData.subject);
          setFeedbackId(feedbackData.id);
        }
      } catch (error) {
        console.error('Error fetching maintenance data:', error);
      }
    };
    fetchMaintenanceData();
  }, [maintenance]);

  const handleFeedbackSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const feedbackData = {
        maintenance: { id: maintenance.id },
        client: { id: maintenance.client.id },
        subject: satisfaction,
      };

      if (feedbackId) {
        feedbackData.id = feedbackId;
        await updateFeedback(token, feedbackData);
      } else {
        const newFeedback = await addFeedback(token, feedbackData);
        setFeedbackId(newFeedback.id);
      }

      setSubmittedFeedback(satisfaction);
      setFeedbackVisible(false);
    } catch (error) {
      console.error('Error submitting feedback:', error.response?.data || error.message);
    }
  };

  const toggleFeedbackForm = () => {
    setFeedbackVisible(!feedbackVisible);
  };

  if (!maintenanceDetail) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const {
    title,
    description,
    msdate,
    startAt,
    endAt,
    technician,
    device,
  } = maintenanceDetail;

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.label}>Title:</Text>
          <Text>{title}</Text>

          <Text style={styles.label}>Description:</Text>
          <Text>{description}</Text>

          <Text style={styles.label}>Date:</Text>
          <Text>{msdate}</Text>

          <Text style={styles.label}>Start at:</Text>
          <Text>{formatTime(startAt)}</Text>

          <Text style={styles.label}>End at:</Text>
          <Text>{formatTime(endAt)}</Text>

          <Text style={styles.label}>Technician:</Text>
          <Text>{technician ? `${technician.fname} ${technician.lname}` : 'N/A'}</Text>

          <Text style={styles.label}>Device:</Text>
          {device ? (
            <View style={styles.deviceContainer}>
              <Text>Name: {device.name}{device.id}</Text>
              <Text>Serial: {device.serial}</Text>
              <Text>Description: {device.description}</Text>
              <Text>IP Address: {device.ipAddress}</Text>
              <Text>MAC Address: {device.macAddress}</Text>
              <Text>Purchase Date: {device.purchaseDate}</Text>
              <Text>Repair Number: {device.repair_nbr}</Text>
              {device.client && typeof device.client === 'object' ? null : <Text>Client: {device.client}</Text>}
              {device.model && typeof device.model === 'object' ? null : <Text>Model: {device.model}</Text>}
              <Text>End of Service Date: {device.eosdate}</Text>
            </View>
          ) : (
            <Text>N/A</Text>
          )}
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={toggleFeedbackForm}>
        {feedbackVisible ? 'Cancel Feedback' : submittedFeedback ? 'Edit Feedback' : 'Add Feedback'}
      </Button>
      {feedbackVisible && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.label}>How satisfied are you with the service?</Text>
          <RadioButton.Group
            onValueChange={newValue => setSatisfaction(newValue)}
            value={satisfaction}
          >
            <View style={styles.radioButton}>
              <RadioButton value="Very Satisfied" />
              <Text>Very Satisfied</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Satisfied" />
              <Text>Satisfied</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Neutral" />
              <Text>Neutral</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Dissatisfied" />
              <Text>Dissatisfied</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Very Dissatisfied" />
              <Text>Very Dissatisfied</Text>
            </View>
          </RadioButton.Group>
          <Button mode="contained" onPress={handleFeedbackSubmit}>
            Submit Feedback
          </Button>
        </View>
      )}
      {submittedFeedback && (
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.label}>Feedback:</Text>
            <Text>{submittedFeedback}</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  deviceContainer: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  feedbackContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default ViewMntScreen;
