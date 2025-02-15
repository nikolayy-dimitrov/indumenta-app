import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS !== "web") {
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (libraryStatus !== "granted") {
            Alert.alert(
                "Permissions required",
                "We need access to your photo library to pick images.",
                [{ text: "OK" }]
            );
            return false;
        }
    }
    return true;
};

export const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== "web") {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

        if (cameraStatus !== "granted") {
            Alert.alert(
                "Permissions required",
                "We need access to your camera to take photos.",
                [{ text: "OK" }]
            );
            return false;
        }
    }
    return true;
};

export const pickImage = async (
    requestGalleryPermission: () => Promise<boolean>
): Promise<{ uri: string; mimeType: string } | null> => {
    const hasGalleryPermission = await requestGalleryPermission();
    if (!hasGalleryPermission) return null;

    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]) {
            return {
                uri: result.assets[0].uri,
                mimeType: result.assets[0].mimeType || 'image/jpeg'
            };
        }
        return null;
    } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Failed to pick an image. Please try again.");
        return null;
    }
};

export const takePhoto = async (
    requestPermission: () => Promise<boolean>
): Promise<{ uri: string; mimeType: string } | null> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return null;

    try {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]) {
            return {
                uri: result.assets[0].uri,
                mimeType: result.assets[0].mimeType || 'image/jpeg'
            };
        }
        return null;
    } catch (error) {
        console.error("Error taking photo:", error);
        Alert.alert("Error", "Failed to take a photo. Please try again.");
        return null;
    }
};
