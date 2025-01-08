import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { AuthContext } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import LoadingScreen from "@/components/LoadingScreen.tsx";

import { handleUpload } from "@/utils/imageUploadUtils.ts";
import { extractDominantColor } from "@/utils/colorUtils.ts";
import { pickImage, requestCameraPermission, requestGalleryPermission, takePhoto } from "@/utils/imagePickerUtils.ts";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/../firebaseConfig.ts";

import { faArrowRight, faImage, faUpload } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface UploadProps {
    onNext: () => void;
}

const Upload: React.FC<UploadProps> = ({ onNext }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [dominantColor, setDominantColor] = useState<string | null>(null);
    const [clothesCount, setClothesCount] = useState<number>(0);

    const { user, isLoading, setIsLoading } = useContext(AuthContext);

    const colorScheme = useColorScheme();
    const dynamicIconStyle = {
        color: colorScheme === "dark" ? "#F8E9D5" : "#181819",
    };

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
            <LoadingScreen />
        )
    }

    return (
        <SafeAreaView className="flex-1 justify-center items-center p-4">

            {/* Display Selected Image */}
            {imageUri ? (
                <View className="my-4 overflow-hidden rounded-2xl h-96 w-11/12">
                    <Image
                        source={{ uri: imageUri }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
            ) : (
                <View className="my-4 overflow-hidden bg-secondary/5 dark:bg-primary/5 rounded h-96 w-11/12 items-center justify-center flex">
                    <FontAwesomeIcon icon={faImage} style={dynamicIconStyle} size={20} />
                </View>
            )}

            {/* Image Selection Options */}
            <View className="flex items-center justify-center gap-2 w-11/12 my-4">
                <CustomButton
                    icon={faImage}
                    handlePress={() => pickImage(setImageUri, requestGalleryPermission)}
                    containerStyles="w-full"
                    textStyles="mx-2"
                    title="Gallery"
                />

                <CustomButton
                    icon={faCamera}
                    handlePress={() => takePhoto(setImageUri, requestCameraPermission)}
                    containerStyles="w-full"
                    textStyles="mx-2"
                    title="Take Photo"
                />
            </View>

            <TouchableOpacity
                onPress={() => handleUploadImage}
                className="flex-row items-center justify-center gap-2 bg-primary dark:bg-secondary w-full py-4 my-2
                 border border-secondary/60 dark:border-primary/50 rounded-lg disabled:opacity-60"
                disabled={!imageUri || isLoading}
            >
                <FontAwesomeIcon
                    icon={faUpload}
                    style={dynamicIconStyle}
                />
                <Text className="font-medium text-secondary dark:text-primary">
                    Upload
                </Text>
            </TouchableOpacity>

            {clothesCount >= 3 ? (
                <TouchableOpacity
                    onPress={() => handleNext()}
                    className="flex-row items-center justify-center gap-2 bg-content/80 w-full py-4 border border-secondary/40 rounded-lg absolute bottom-0">
                    <Text className="font-medium">
                        Select Style
                    </Text>
                    <FontAwesomeIcon icon={faArrowRight} />
                </TouchableOpacity>
                ) : (
                    <View className="py-8 top-8 absolute">
                        <Text className="text-center text-secondary dark:text-primary">Please upload at least 3 pieces of clothing to proceed.</Text>
                    </View>
            )}

        </SafeAreaView>
    );
};

export default Upload;