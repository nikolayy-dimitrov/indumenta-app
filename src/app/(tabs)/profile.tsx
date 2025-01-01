import { View, Text } from "react-native";
import React, { useContext } from "react";
import { signOut } from "@firebase/auth";
import { auth } from "@/../firebaseConfig";
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthContext"
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";

const Profile = () => {
    const { user } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView className="bg-primary dark:bg-secondary h-full font-Josefin pt-12">
            <View className="px-4 my-6 justify-center items-center">
                <Text className="text-secondary dark:text-primary text-3xl font-semibold">
                    {user?.displayName
                        ? `Hello, ${user?.displayName}!`
                        : `Welcome to INDUMENTA`
                    }
                </Text>
                <CustomButton
                    title={"logout"}
                    handlePress={() => handleLogout()}
                    containerStyles="px-8 mt-4"
                />
            </View>
        </SafeAreaView>
    )
}

export default Profile;
