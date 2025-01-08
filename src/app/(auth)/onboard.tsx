import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router } from "expo-router";

const Onboard: React.FC = () => {
    const colorScheme = useColorScheme();
    const dynamicIconStyle = {
        color: colorScheme === "light" ? "#F8E9D5" : "#181819",
    };
    const reverseDynamicIconStyle = {
        color: colorScheme === "dark" ? "#F8E9D5" : "#181819",
    }

    return (
        <SafeAreaView className="bg-primary dark:bg-secondary h-full">
            <View className="flex-1 items-center justify-center gap-1">
                <Text className="text-secondary dark:text-primary font-semibold text-3xl uppercase tracking-wider">
                    Create an account
                </Text>
                <Text className="text-secondary/80 dark:text-primary/80 font-medium text-md lowercase tracking-widest">
                    redefine your style
                </Text>
            </View>
            <View className="flex-1 items-center justify-center gap-4">
                <TouchableOpacity
                    className="flex-row items-center px-8 gap-16 bg-secondary dark:bg-primary py-5 w-11/12 rounded-3xl"
                >
                    <FontAwesomeIcon icon={faGoogle} style={dynamicIconStyle} />
                    <Text className="lowercase text-primary dark:text-secondary font-medium">
                        Continue with Google
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push("/register")}
                    className="flex-row items-center px-8 gap-16 bg-primary dark:bg-secondary
                    border border-secondary dark:border-primary py-5 w-11/12 rounded-3xl"
                >
                    <FontAwesomeIcon icon={faEnvelope} style={reverseDynamicIconStyle} />
                    <Text className="lowercase text-secondary dark:text-primary font-medium">
                        Continue with Email
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="absolute bottom-0 w-full">
                <View className="flex-row items-center justify-center gap-1">
                    <Text className="lowercase text-secondary/60 dark:text-primary/60">
                        Have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/login")}
                        className="py-6"
                    >
                        <Text className="uppercase tracking-wide underline underline-offset-auto text-secondary dark:text-primary/60">
                            Sign in
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Onboard;