import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Card, Avatar } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { editUser, getUser } from '../api/client';
import mime from 'mime';
import { API_BASE_URL } from '../config';

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
      const updatedUser = { ...user };
      const token = await AsyncStorage.getItem('token');
      await editUser(token, updatedUser);
      console.log('Saved');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleEditPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      if (uri) {
        const mimeType = mime.getType(uri) || 'image/jpeg';
        const fileName = uri.split('/').pop() || `photo.${mimeType.split('/')[1]}`;

        const formData = new FormData();
        formData.append('file', {
          uri: uri,
          type: mimeType,
          name: fileName,
        });

        console.log('FormData:', formData);

        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/v1/images/upload`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          console.log('Response:', response);

          if (response.status === 200) {
            const url = response.data.secure_url;
            const updatedUser = {
              ...user,
              photo: url || undefined,
            };
            const token = await AsyncStorage.getItem('token');
            await editUser(token, updatedUser);
            setUser(updatedUser);
            Alert.alert('Success', 'Photo uploaded successfully!');
          } else {
            console.error('Error uploading photo:', response.statusText);
            Alert.alert('Error', 'Error uploading photo:' + response.statusText);
          }
        } catch (err) {
          console.error('Axios Error:', err);
          console.error('Error Message:', err.message);
          console.error('Error Code:', err.code);
          console.error('Error Config:', err.config);
          console.error('Error Request:', err.request);
          console.error('Error Response:', err.response);
          Alert.alert('Error', 'Error uploading photo: ' + err.message);
        }
      }
    }
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
              source={{
                uri: user.photo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
              }}
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
            onChangeText={(text) => setUser({ ...user, fname: text })}
            mode="outlined"
            style={styles.input}
            editable={isEditing}
          />
          <TextInput
            label="Last Name"
            value={user.lname}
            onChangeText={(text) => setUser({ ...user, lname: text })}
            mode="outlined"
            style={styles.input}
            editable={isEditing}
          />

          <TextInput
            label="Phone"
            value={user.phone}
            onChangeText={(text) => setUser({ ...user, phone: text })}
            mode="outlined"
            style={styles.input}
            editable={isEditing}
          />

          <TextInput
            label="Email"
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
            mode="outlined"
            style={styles.input}
            editable={isEditing}
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
