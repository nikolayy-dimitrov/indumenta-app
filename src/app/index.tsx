import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, useColorScheme, ImageBackground } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

import '../utils/fontawesome';
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";

export default function App() {
    const colorScheme = useColorScheme();
    const { user } = useAuth();

  return (
          <SafeAreaView className="bg-primary dark:bg-secondary h-full">
                <View className="w-full justify-center items-center h-full">
                    <Text
                        className="text-3xl font-bold leading-tight font-Josefin
                        text-primary dark:text-secondary bg-secondary/90 dark:bg-primary/90 py-2 px-4 rounded-sm">
                        INDUMENTA
                    </Text>
                    <View
                        className="absolute bottom-12 bg-secondary dark:bg-primary rounded-xl w-1/2 mt-4
                        shadow shadow-primary dark:shadow-secondary">
                        <CustomButton
                            title="Begin styling"
                            handlePress={() => router.push(user ? '/wardrobe' : '/onboard')}
                        />
                    </View>
                </View>
              <StatusBar
                  backgroundColor={colorScheme === "dark" ? "#181819" : "#F8E9D5"}
                  style={colorScheme === "light" ? "light" : "dark"}
              />
          </SafeAreaView>
  )
}
