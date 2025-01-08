import { View, Text, TextInput, TouchableOpacity, useColorScheme } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile } from "@firebase/auth";
import { auth } from "@/../firebaseConfig"
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

type RegisterScreen = 'email' | 'password' | 'username';

const Register: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<RegisterScreen>('email')
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const colorScheme = useColorScheme();
    const dynamicIconStyle = {
        color: colorScheme === 'dark' ? "#F8E9D5" : "#181819",
    }

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user

            if (user) {
                await updateProfile(user, { displayName: username });
            }

            router.push("/home");
        } catch (err) {
            if ((err as any).code === 'auth/email-already-in-use') {
                setError('This email address is already in use. Please try logging in or use a different email.');
            } else {
                setError((err as Error).message); // General error handling
            }
        }
    };

    const handleOnNext = async () => {
        if (currentScreen === 'email') {
            if (!validateEmail(email)) {
                setError('Please enter a valid email address.');
                return;
            }

            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                setError('This email is already in use. Please use a different email or log in.');
                return;
            }

            setError('');
            setCurrentScreen('password');
        } else if (currentScreen === 'password') {
            if (!validatePassword(password)) {
                setError(
                    'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
                );
                return;
            }
            setError('');
            setCurrentScreen('username');
        } else {
            if (!username) {
                setError('Username cannot be empty.');
                return;
            }
            setError('');
            await handleRegister();
        }
    }

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        // Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };


    return (
        <SafeAreaView className="bg-primary dark:bg-secondary h-full font-Josefin items-center">
            {error ? (
                <Text className="absolute bottom-20 text-red-600 text-center my-2">{error}</Text>
            ) : null}
            <View className="w-full h-full my-6 px-6">
                <View className="w-full flex-row items-center justify-center">
                    <TouchableOpacity onPress={router.back} className="p-2 -mx-2">
                        <FontAwesomeIcon icon={faAngleLeft} size={20} style={dynamicIconStyle} />
                    </TouchableOpacity>
                    <Text className="text-3xl font-semibold text-secondary dark:text-primary mx-auto">
                        INDUMENTA
                    </Text>
                </View>
                {currentScreen === 'email' ? (
                    <View className="flex-1 justify-center">
                        <View className="w-full h-1/2 gap-6">
                            <Text className="text-secondary dark:text-primary font-medium lowercase tracking-wider">
                                Enter your email
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="EMAIL"
                                className="w-full py-2 px-2 border-b border-secondary dark:border-primary
                                 focus:outline-none text-secondary dark:text-primary
                                 placeholder:text-secondary/70 placeholder:dark:text-primary/70"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                maxLength={80}
                            />
                        </View>
                    </View>
                ) : currentScreen === 'password' ? (
                    <View className="flex-1 justify-center">
                        <View className="w-full h-1/2 gap-6">
                            <Text className="text-secondary dark:text-primary font-medium lowercase tracking-wider">
                                Create a password
                            </Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="PASSWORD"
                                className="w-full py-2 px-2 border-b border-secondary dark:border-primary
                                 focus:outline-none text-secondary dark:text-primary
                                 placeholder:text-secondary/70 placeholder:dark:text-primary/70"
                                secureTextEntry={true}
                                keyboardType="default"
                                maxLength={80}
                                textContentType="newPassword"
                                autoCapitalize={'none'}
                            />
                        </View>
                    </View>
                ) : currentScreen === 'username' && (
                    <View className="flex-1 justify-center">
                        <View className="w-full h-1/2 gap-6">
                            <Text className="text-secondary dark:text-primary font-medium lowercase tracking-wider">
                                Enter your username
                            </Text>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="USERNAME"
                            textContentType="username"
                            maxLength={30}
                            className="w-full py-2 px-2 border-b border-secondary dark:border-primary
                                 focus:outline-none text-secondary dark:text-primary
                                 placeholder:text-secondary/70 placeholder:dark:text-primary/70"
                        />
                        </View>
                    </View>
                )}
            </View>
            <TouchableOpacity
                onPress={handleOnNext}
                className="absolute bottom-12 p-4 w-11/12 bg-secondary dark:bg-primary rounded-xl">
                <Text className="text-primary dark:text-secondary text-center font-medium lowercase">
                    Continue
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Register;