import React, { useState, useEffect } from'react';
import { View, StyleSheet, ScrollView } from'react-native';
import { Text, Button, TextInput, Card, Avatar } from'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { editUser, getUser } from '../api/client';

const ProfileScreen = () => {
  const route = useRoute();
  const { id } = route.params;

  const [user, setUser] = useState({
    fname: '',
    lname: '',
    phone: '',
    email: '',
    photo: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await getUser(token, id);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [id]);

  const handleSave = async () => {
    try {
      const updatedUser = {...user };
      const token = await AsyncStorage.getItem('token');
      await editUser(token, updatedUser);
      console.log('Saved');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleEditPhoto = () => {
    // Implement edit photo logic here
    console.log('Upload photo');
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={100}
              source={{ uri: user.photo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
            />
            <Button
              mode="contained"
              onPress={handleEditPhoto}
              style={styles.editPhotoButton}
            >
              Upload Photo
            </Button>
          </View>

          <Text style={styles.label}>User ID: {id}</Text>

          <TextInput
            label="First Name"
            value={user.fname}
            onChangeText={(text) => setUser({...user, fname: text })}
            mode="outlined"
            style={styles.input}
            editable={isEditing}
          />
          <TextInput
            label="Last Name"
            value={user.lname}
            onChangeText={(text) => setUser({...user, lname: text })}
            mode="outlined"
            style={styles.input}
            editable={isEditing}
          />

          <TextInput
            label="Phone"
            value={user.phone}
            onChangeText={(text) => setUser({...user, phone: text })}
            mode="outlined"
            style={styles.input}
            editable={isEditing}
          />

          <TextInput
            label="Email"
            value={user.email}
            onChangeText={(text) => setUser({...user, email: text })}
            mode="outlined"
            style={styles.input}
            editable={isEditing}
          />

          {isEditing? (
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
            >
              Save
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={toggleEditMode}
              style={styles.editButton}
            >
              Edit Information
            </Button>
          )}
        </Card.Content>
      </Card>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  editPhotoButton: {
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
  },
  editButton: {
    marginTop: 16,
    backgroundColor: '#6200ee',
  },
});

export default ProfileScreen;
