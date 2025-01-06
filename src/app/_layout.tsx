import "@/global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function Layout() {
  return (
      <AuthProvider>
          <ActionSheetProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
          </ ActionSheetProvider>
      </AuthProvider>
  );
}
