import "@/global.css";
import { SplashScreen, Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const [fontsLoaded, error] = useFonts({
        "JosefinSans-Black": require("@/../assets/fonts/JosefinSans-Bold.ttf"),
        "JosefinSans-Bold": require("@/../assets/fonts/JosefinSans-BoldItalic.ttf"),
        "JosefinSans-ExtraLight": require("@/../assets/fonts/JosefinSans-ExtraLight.ttf"),
        "JosefinSans-ExtraLightItalic": require("@/../assets/fonts/JosefinSans-ExtraLightItalic.ttf"),
        "JosefinSans-Italic": require("@/../assets/fonts/JosefinSans-Italic.ttf"),
        "JosefinSans-Light": require("@/../assets/fonts/JosefinSans-Light.ttf"),
        "JosefinSans-LightItalic": require("@/../assets/fonts/JosefinSans-LightItalic.ttf"),
        "JosefinSans-Medium": require("@/../assets/fonts/JosefinSans-Medium.ttf"),
        "JosefinSans-MediumItalic": require("@/../assets/fonts/JosefinSans-MediumItalic.ttf"),
        "JosefinSans-Regular": require("@/../assets/fonts/JosefinSans-Regular.ttf"),
        "JosefinSans-SemiBold": require("@/../assets/fonts/JosefinSans-SemiBold.ttf"),
        "JosefinSans-BoldItalic": require("@/../assets/fonts/JosefinSans-SemiBoldItalic.ttf"),
        "JosefinSans-Thin": require("@/../assets/fonts/JosefinSans-Thin.ttf"),
        "JosefinSans-ThinItalic": require("@/../assets/fonts/JosefinSans-ThinItalic.ttf"),
    });

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded) {
        return null;
    }

    if (!fontsLoaded && !error) {
        return null;
    }

  return (
      <AuthProvider>
          <ActionSheetProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
          </ ActionSheetProvider>
      </AuthProvider>
  );
}
