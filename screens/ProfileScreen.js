import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, TextInput, Card, Avatar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { editUser } from '../api/client';

const ProfileScreen = () => {
  const route = useRoute();
  const { user } = route.params;

  const [firstName, setFirstName] = useState(user.fname);
  const [lastName, setLastName] = useState(user.lname);
  const [phoneNbr, setPhoneNbr] = useState(user.phone);
  const [emailAdr, setEmailAdr] = useState(user.email);


  const [profilePhoto, setProfilePhoto] = useState(user.photo);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      const updatedUser = {
        ...user,
        fname: firstName,
        lname: lastName,
        phone: phoneNbr,
        email: emailAdr,
      };

      // get token
      const token = await AsyncStorage.getItem('token');

      // Call editUser API to update user information
      await editUser(token, updatedUser);

      console.log('Saved:');
      setIsEditing(false); // Disable editing after saving
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
              source={{ uri: profilePhoto || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
            />
            <Button
              mode="contained"
              onPress={handleEditPhoto}
              style={styles.editPhotoButton}
            >
              Upload Photo
            </Button>
          </View>

          <Text style={styles.label}>User ID: {user.id}</Text>

          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            style={styles.input}
            editable={isEditing} // Control whether the input is editable
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            style={styles.input}
            editable={isEditing} // Control whether the input is editable
          />

          <TextInput
            label="Phone"
            value={phoneNbr}
            onChangeText={setPhoneNbr}
            mode="outlined"
            style={styles.input}
            editable={isEditing} // Control whether the input is editable
          />

          <TextInput
            label="Email"
            value={emailAdr}
            onChangeText={setEmailAdr}
            mode="outlined"
            style={styles.input}
            editable={isEditing} // Control whether the input is editable
          />

          {isEditing ? (
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
