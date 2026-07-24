import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResetPasswordScreen() {
  const router = useRouter();
  // Expo Router way to grab parameters passed from router.push
  const params = useLocalSearchParams();
  const [email, setEmail] = useState((params.email as string) || '');
  
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!token.trim() || !newPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // ⚠️ Replace 192.168.x.x with your actual computer's IP address!
      const response = await fetch('http://10.218.52.196:8080/api/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), newPassword }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Your password has been reset! Please sign in.', [
          { 
            text: 'OK', 
            // Expo Router way to navigate back to sign in:
            onPress: () => router.replace('/signin') 
          }
        ]);
      } else {
        const errorText = await response.text();
        Alert.alert('Error', errorText || 'Invalid or expired token.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your backend connection.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Reset Token from Email"
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 },
});