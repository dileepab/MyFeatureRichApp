import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import {useAuth} from "@/app/context/AuthContext";
import {ThemedView} from "@/components/ThemedView";
import {ThemedTextInput} from "@/components/ThemedTextInput";
import {useThemeColor} from "@/hooks/useThemeColor";
import {ThemedText} from "@/components/ThemedText";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordWrapperFocused, setIsPasswordWrapperFocused] =
    useState(false); // Focus state for password wrapper

  const color = useThemeColor( {},'icon');
  const borderColor = useThemeColor({}, 'inputBorder');

  const { login } = useAuth();

  const handleLogin = async () => {
    // Clear any previous error messages
    setError("");
    // Basic form validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (password.length <= 3) {
      setError("Password must be more than 3 characters.");
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
          rememberMe // Assuming you have an 'isRemember' state variable
        })
      });
      const jsonData = await response.json();

      if (!response.ok) { // Check for any non-2xx status codes
        setError(jsonData.message || 'Login failed');
        return;
      }

      // Extract relevant data from the response
      const userData = {
        email: email,
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

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ThemedView style={styles.container}>
      {/* logo */}
      <Image
        source={require("../../assets/images/alfresco.png")}
        style={styles.logo}
      />
      <ThemedText type={'title'} style={styles.title}>Welcome</ThemedText>

      <ThemedView
        style={[
          styles.inputWrapper,
          isEmailFocused && styles.focusedWrapper,
        ]}
      >
      <ThemedTextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus={true}
      />
      </ThemedView>

      <ThemedView
        style={[
          styles.inputWrapper,
          isPasswordWrapperFocused && styles.focusedWrapper,
        ]}
      >
        <ThemedTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          onFocus={() => setIsPasswordWrapperFocused(true)}
          onBlur={() => setIsPasswordWrapperFocused(false)}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
        >
          <Feather
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={16}
            color={color}
          />
        </TouchableOpacity>
      </ThemedView>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.rememberMeContainer}>
        <TouchableOpacity onPress={toggleRememberMe}>
          <MaterialCommunityIcons
            name={rememberMe ? "checkbox-outline" : "checkbox-blank-outline"}
            size={24}
            color={borderColor}
          />
        </TouchableOpacity>
        <ThemedText onPress={toggleRememberMe}>
          Remember Me
        </ThemedText>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    height: 42,
    overflow: 'hidden',
  },
  focusedWrapper: {
    borderColor: "#2596be",
    borderWidth: 1,
  },
  iconContainer: {
    height: 50,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  focusedInput: {
    borderColor: "#2596be",
    borderWidth: 1,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    width: "100%",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    gap: 8,
    marginLeft: 3,
    alignSelf: "flex-start",
  },
  rememberMeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#2596be",
    padding: 14,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
