import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, Platform, View, Text } from 'react-native';
import { AuthContext } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";

import * as ImagePicker from "expo-image-picker";
import { handleUpload } from "@/utils/imageUploadUtils.ts";
import { extractDominantColor } from "@/utils/colorUtils.ts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/../firebaseConfig.ts";

import { faImage } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

interface UploadProps {
    onNext: () => void;
}

const Upload: React.FC<UploadProps> = ({ onNext }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [dominantColor, setDominantColor] = useState<string | null>(null);
    const [clothesCount, setClothesCount] = useState<number>(0);

    const { user, isLoading, setIsLoading } = useContext(AuthContext);

    useEffect(() => {
        const fetchDominantColor = async () => {
            if (imageUri) {
                try {
                    const color = await extractDominantColor(imageUri);
                    setDominantColor(color);
                    console.log(color);
                } catch (error) {
                    console.error('Failed to extract dominant color:', error);
                    setDominantColor('#FFFFFF');
                }
            }
        };

        fetchDominantColor();
    }, [imageUri]);

    const handleUploadSuccess = async () => {
        setImageUri(null);
        setDominantColor(null);
        setIsLoading(false);
    };

    const handleUploadError = (error: Error) => {
        console.error(error);
        setIsLoading(false);
    };

    const handleUploadImage = async () => {
        if (!imageUri) {
            Alert.alert("Error", "Please select an image to upload.");
            return;
        }

        if (!user || !user.uid) {
            Alert.alert("Error", "User authentication required.");
            return;
        }

        setIsLoading(true);

        try {
            // Fetch the file from the URI and create a Blob
            const response = await fetch(imageUri);
            const blob = await response.blob();

            // Extract the file name from the URI or use a timestamp
            const fileName = imageUri.split('/').pop() || `image_${Date.now()}.jpg`;

            // Convert Blob to File
            const file = new File([blob], fileName, { type: blob.type });

             // Replace with ColorThief logic if necessary
            await handleUpload([file], user, [dominantColor!], handleUploadSuccess, handleUploadError);

            Alert.alert("Success", "Image uploaded successfully!");
            setImageUri(null); // Reset image after successful upload
            await handleNext();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Image upload failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Request media library permissions
    const requestGalleryPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (libraryStatus !== 'granted') {
                Alert.alert(
                    'Permissions required',
                    'We need access to your photo library to pick images.',
                    [{ text: 'OK' }]
                );
                return false;
            }
        }
        return true;
    };

    // Request camera permission
    const requestCameraPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

            if (cameraStatus !== 'granted') {
                Alert.alert(
                    'Permissions required',
                    'We need access to your camera to take photos.',
                    [{ text: 'OK' }]
                );
                return false;
            }
        }
        return true;
    };

    // Image picker function
    const pickImage = async () => {
        // Check gallery permission
        const hasGalleryPermission = await requestGalleryPermission();
        if (!hasGalleryPermission) return;

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                base64: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0].uri;
                setImageUri(selectedImage);
            }

        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert(
                'Error',
                'Failed to pick an image. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    // Camera capture alternative
    const takePhoto = async () => {
        // Check camera permission
        const hasCameraPermission = await requestCameraPermission();
        if (!hasCameraPermission) return;

        try {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const capturedImage = result.assets[0].uri;
                setImageUri(capturedImage);
            }

        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert(
                'Error',
                'Failed to take a photo. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    useEffect(() => {
        const checkClothesCount = async (): Promise<number> => {
            if (!user) return 0;

            const clothesRef = collection(db, "clothes");
            const q = query(clothesRef, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            setClothesCount(querySnapshot.size);
            return querySnapshot.size;
        };
        checkClothesCount();
    }, [user, isLoading]);

    const handleNext = async () => {
        if (clothesCount >= 3) {
            onNext();
        }
    };

    if (isLoading) {
        return (
            <View className="flex justify-center items-center h-screen font-Josefin">
                <Text className="text-primary">Loading...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 justify-center items-center p-4">
            {/* Image Selection Options */}
            <View className="flex flex-row items-center justify-center gap-4">
                <CustomButton
                    icon={faImage}
                    handlePress={pickImage}
                    containerStyles="py-6 px-6"
                />

                <CustomButton
                    icon={faCamera}
                    handlePress={takePhoto}
                    containerStyles="py-6 px-6"
                />
            </View>

            {/* Display Selected Image */}
            {imageUri && (
                <View className="my-4 overflow-hidden rounded-2xl w-60 h-60">
                    <Image
                        source={{ uri: imageUri }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
            )}

            <CustomButton
                title="Upload Image"
                handlePress={handleUploadImage}
                disabled={!imageUri || isLoading}
                containerStyles="py-2 px-12 bottom-12 absolute"
            />

            {clothesCount >= 3 ? (
                <CustomButton
                    title="Select Style"
                    handlePress={handleNext}
                    containerStyles="py-2 px-12 top-12 absolute"
                />
                ) : (
                    <View className="py-8 top-8 absolute">
                        <Text className="text-center text-secondary dark:text-primary">Please upload at least 3 pieces of clothing to proceed.</Text>
                    </View>
            )}

        </SafeAreaView>
    );
};

export default Upload;