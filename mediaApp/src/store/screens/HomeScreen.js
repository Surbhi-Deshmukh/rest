import React from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <View>
      <Text>Welcome, {user.email}</Text>
      <Button title="Capture Media" onPress={() => navigation.navigate('Media')} />
      <Button title="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
};

export default HomeScreen;
