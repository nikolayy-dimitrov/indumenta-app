import { View, Text, ScrollView, Alert, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth } from "@/../firebaseConfig"
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";

const Register: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/login");
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <SafeAreaView className="bg-primary dark:bg-secondary h-full font-Josefin">
            <ScrollView>
                <View className="w-full h-full justify-center px-6 my-6">
                    <Text className="text-secondary dark:text-primary text-4xl font-semibold">
                        Sign Up
                    </Text>
                    <View className="mt-4">
                        <View className="mb-4">
                            <Text className="text-secondary dark:text-primary font-bold mb-2">Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder=""
                                className="w-full py-2 px-3 border border-secondary dark:border-primary rounded focus:outline-none text-secondary dark:text-primary"
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                        <View className="mb-4">
                            <Text className="text-secondary dark:text-primary font-bold mb-2">Password</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder=""
                                className="w-full py-2 px-3 border border-secondary dark:border-primary rounded focus:outline-none text-secondary dark:text-primary"
                                secureTextEntry
                            />
                        </View>
                        <View className="mb-6">
                            <Text className="text-secondary dark:text-primary font-bold mb-2">
                                Confirm Password
                            </Text>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder=""
                                className="w-full py-2 px-3 border border-secondary dark:border-primary rounded focus:outline-none text-secondary dark:text-primary"
                                secureTextEntry
                            />
                        </View>
                        <CustomButton
                            handlePress={handleRegister}
                            title="Register" />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Register;