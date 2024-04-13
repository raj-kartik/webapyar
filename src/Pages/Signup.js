import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Pressable } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Signup = () => {
    const navigation = useNavigation();
    const [name, setname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [signupError, setSignupError] = useState('');

    const handleSignup = async () => {
        let retries = 3; // Number of retries
        while (retries > 0) {
            try {
                const response = await axios.post('https://test.webyaparsolutions.com/auth/user/signup', {
                    email,
                    name,
                    password,
                });
                if (response.status === 200) {
                    console.log('Signup successful:', response.data);
                    navigation.navigate('Login'); // Navigate to the login screen
                    return; // Exit function after successful signup
                } else {
                    console.log('Signup failed with status:', response.status);
                    setSignupError('Failed to sign up. Please try again.');
                    return; // Exit function after failed signup
                }
            } catch (err) {
                console.error("Signup failed", err);
                retries--; // Decrement retry count
                if (retries === 0) {
                    setSignupError('Signup failed. Please try again later.');
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
                }
            }
        }
    };
    

    const handleGoToLogin = () => {
        navigation.navigate('Login');
    }

    const isEmailValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.includes('@gmail.com');
    };

    const isPasswordValid = (password) => {
        // Password validation criteria
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

        return (
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChars
        );
    };

    const isFormValid = () => {
        return (
            name.trim() !== '' &&
            email.trim() !== '' &&
            password.trim() !== '' &&
            confirmPassword.trim() !== '' &&
            password === confirmPassword &&
            isEmailValid(email) &&
            isPasswordValid(password)
        );
    };

    const handleSubmit = () => {
        setIsSubmitted(true); // Set isSubmitted to true before checking form validity
        if (isFormValid()) {
            handleSignup();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setname}
                    placeholder="Enter your full name"
                    style={styles.textInputStyle}
                    placeholderTextColor={"#ccc"}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textInputStyle}
                    placeholderTextColor={"#ccc"}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                    style={styles.textInputStyle}
                    placeholderTextColor={"#ccc"}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    secureTextEntry
                    style={styles.textInputStyle}
                    placeholderTextColor={"#ccc"}
                />
            </View>

            <TouchableOpacity
                style={[styles.button, !isFormValid() && styles.disabled]}
                disabled={!isFormValid()}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {isSubmitted && !isFormValid() && <Text style={styles.errorText}>Please fill all the input fields correctly</Text>}

            <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account?</Text>
                <Pressable onPress={handleGoToLogin}>
                    <Text style={styles.signInLink}>Sign In</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 20,
        width: '80%',
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: '#000',
        fontWeight:"bold"
    },
    textInputStyle: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        color:"#000",
    },
    button: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    disabled: {
        opacity: 0.5,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    signInContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    signInText: {
        marginRight: 5,
        color:"#000",
        fontWeight:"bold",
    },
    signInLink: {
        color: 'blue',
        textDecorationLine: 'underline',
        fontWeight:"bold",
    },
});

export default Signup;
