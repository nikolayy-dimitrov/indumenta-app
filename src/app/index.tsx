import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, useColorScheme } from "react-native";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

import '../utils/fontawesome';
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";

export default function App() {
    const colorScheme = useColorScheme();
    const { user } = useAuth();

  return (
          <SafeAreaView className="bg-primary dark:bg-secondary h-full">
              <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="w-full justify-center items-center h-full px-4">
                    <Text className="text-3xl font-bold leading-tight font-Josefin text-secondary dark:text-primary">
                        INDUMENTA
                    </Text>
                    <View className="bg-secondary dark:bg-primary rounded-xl w-1/2 mt-4">
                        <CustomButton
                            title="Begin styling"
                            handlePress={() => router.push(user ? '/wardrobe' : '/login')}
                        />
                    </View>
                </View>
              </ScrollView>
              <StatusBar
                  backgroundColor={colorScheme === "dark" ? "#181819" : "#F8E9D5"}
                  style={colorScheme === "dark" ? "light" : "dark"}
              />
          </SafeAreaView>
  )
}
