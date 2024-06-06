import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation hook




const ProfileScreen = () => {
    const route = useRoute(); // Access route parameters (to access data)
    const { id, fname, lname } = route.params;

  return (
    <View>

      <View>
         {/* Display user details */}
        <Text>User ID: {id}</Text>
        <Text>First Name: {fname}</Text>
        <Text>Last Name: {lname}</Text>
      </View>
     
    </View>
  );
};

export default  ProfileScreen;