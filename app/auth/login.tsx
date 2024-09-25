import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import {router} from "expo-router";
import {useAuth} from "@/app/context/AuthContext";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated])

  const handleLogin = async () => {
    // Basic form validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,

          isRemember // Assuming you have an 'isRemember' state variable
        })
      });
      const jsonData = await response.json();

      if (!response.ok) { // Check for any non-2xx status codes
        setError(jsonData.message || 'Login failed');
        return;
      }

      // Extract relevant data from the response
      const userData = {
        email: jsonData.email,
        // Add other user details as needed
      };
      const authKey = jsonData.Token; // Use the actual token from the response

      login(userData, authKey); // Call the login function from your context

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Display the error message to the user
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
