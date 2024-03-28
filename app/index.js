import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants'; // Import your constants from the correct path

const apiURL = "https://cop4331-g6-lp-c6d624829cab.herokuapp.com/api";

const Home = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {

         // Log the data before sending
        console.log('Data to be sent:', {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password,
        });
        if (firstName && lastName && username && email && password) {
            try {
                const response = await fetch(apiURL + "/createuser", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        email: email,
                        password: password,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    Alert.alert('Success', 'Sign-up successful!');
                    // Clear input fields after sign-up
                    setFirstName('');
                    setLastName('');
                    setUsername('');
                    setEmail('');
                    setPassword('');
                } else {
                    Alert.alert('Error', data.error || 'Sign-up failed. Please try again.');
                }
            } catch (error) {
                Alert.alert('Error', 'An error occurred. Please try again later.');
                console.error('Error:', error);
            }
        } else {
            Alert.alert('Error', 'Please fill in all fields.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                onChangeText={text => setFirstName(text)}
                value={firstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={text => setLastName(text)}
                value={lastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={text => setUsername(text)}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightWhite,
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: SIZES.body3,
    },
});

export default Home;