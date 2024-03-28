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
            <Text style={styles.label}>First Name</Text>
            <TextInput
                style={[styles.input, firstName ? styles.filledInput : null]}
                placeholder="Enter First Name"
                onChangeText={text => setFirstName(text)}
                value={firstName}
            />
            <Text style={styles.label}>Last Name</Text>
            <TextInput
                style={[styles.input, lastName ? styles.filledInput : null]}
                placeholder="Enter Last Name"
                onChangeText={text => setLastName(text)}
                value={lastName}
            />
            <Text style={styles.label}>Username</Text>
            <TextInput
                style={[styles.input, username ? styles.filledInput : null]}
                placeholder="Enter Username"
                onChangeText={text => setUsername(text)}
                value={username}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[styles.input, email ? styles.filledInput : null]}
                placeholder="Enter Email"
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={[styles.input, password ? styles.filledInput : null]}
                placeholder="Enter Password"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black', // Change background color to black
    },
    label: {
        color: 'white', // Change label text color to white
        fontSize: SIZES.body3,
        marginBottom: 5, // Add margin bottom to labels for spacing
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        color: 'white', // Default text color is white
    },
    filledInput: {
        backgroundColor: 'white', // Background color changes to white when filled
        color: 'black', // Text color changes to black when filled
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: '#CD85F0', // Change button color to light purple
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: 'black', // Change button text color to black
        fontSize: SIZES.body3,
    },
});

export default Home;