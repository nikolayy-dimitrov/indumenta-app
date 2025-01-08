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
    setImageUri: (uri: string) => void,
    requestGalleryPermission: () => Promise<boolean>
) => {
    const hasGalleryPermission = await requestGalleryPermission();
    if (!hasGalleryPermission) return;

    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: false,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImage = result.assets[0].uri;
            setImageUri(selectedImage);
        }
    } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Failed to pick an image. Please try again.", [{ text: "OK" }]);
    }
};

export const takePhoto = async (
    setImageUri: (uri: string) => void,
    requestCameraPermission: () => Promise<boolean>
) => {
    const hasCameraPermission = await requestCameraPermission();
    if (!hasCameraPermission) return;

    try {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const capturedImage = result.assets[0].uri;
            setImageUri(capturedImage);
        }
    } catch (error) {
        console.error("Error taking photo:", error);
        Alert.alert("Error", "Failed to take a photo. Please try again.", [{ text: "OK" }]);
    }
};
