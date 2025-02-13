import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { AuthContext } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

import LoadingScreen from "@/components/LoadingScreen.tsx";

import { handleUpload } from "@/utils/imageUploadUtils.ts";
import { getDominantColors } from "@/utils/colorUtils.ts";
import { pickImage, requestCameraPermission, requestGalleryPermission, takePhoto } from "@/utils/imagePickerUtils.ts";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/../firebaseConfig.ts";

import { faArrowRight, faImage, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
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
                    const color = await getDominantColors(imageUri);
                    setDominantColor(color[0]);
                    console.log('Dominant color:', color[0]);
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
        <SafeAreaView className="flex-1 justify-center items-center px-4 pb-20">

            {/* Display Selected Image */}
            {imageUri ? (
                <View className="my-4 overflow-hidden rounded-2xl h-96 w-11/12">
                    <TouchableOpacity
                        onPress={() => setImageUri(null)}
                        className="absolute top-0 right-0 p-4 z-10"
                    >
                        <FontAwesomeIcon icon={faXmark} size={20} style={dynamicIconStyle} />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: imageUri }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
            ) : (
                <View className='flex-1 items-center justify-center w-11/12 gap-0.5'>
                    <TouchableOpacity
                        onPress={() => pickImage(setImageUri, requestGalleryPermission)}
                        className="overflow-hidden border border-secondary dark:border-primary rounded-t-lg h-1/3 w-full items-center justify-center flex">
                        <FontAwesomeIcon icon={faImage} style={dynamicIconStyle} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => takePhoto(setImageUri, requestCameraPermission)}
                        className="overflow-hidden border border-secondary dark:border-primary rounded-b-lg h-1/3 w-full items-center justify-center flex">
                        <FontAwesomeIcon icon={faCamera} style={dynamicIconStyle} size={20} />
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                onPress={() => handleUploadImage}
                className="flex-row items-center justify-center gap-2 bg-primary dark:bg-secondary w-full py-4 my-8
                 border border-secondary/60 dark:border-primary/50 rounded-lg disabled:hidden"
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
                    className="flex-row items-center justify-center gap-2 bg-secondary/95 w-full py-4 border border-secondary/40 dark:border-primary/40 rounded-lg absolute bottom-4">
                    <Text className="font-medium text-primary">
                        Select Style
                    </Text>
                    <FontAwesomeIcon icon={faArrowRight} style={{ color: "#F8E9D5" }} />
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