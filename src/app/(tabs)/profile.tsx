import { View, Text, TouchableOpacity, Image, useColorScheme, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { signOut, updateProfile } from "@firebase/auth";
import { auth } from "@/../firebaseConfig";
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthContext"
import { SafeAreaView } from "react-native-safe-area-context";
import {faCameraRetro, faGear} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { pickImage, requestGalleryPermission} from "@/utils/imagePickerUtils.ts";

const Profile = () => {
    const { user } = useContext(AuthContext);

    const [userPhoto, setUserPhoto] = useState<string | null>(user?.photoURL || null);

    const colorScheme = useColorScheme();
    const dynamicIconStyle = {
        color: colorScheme === 'light' ? "#F8E9D5" : "#181819",
    };
    const reverseIconStyle = {
        color: colorScheme === "dark" ? "#F8E9D5" : "#181819",
    }

    const creationTime = user?.metadata.creationTime
        ? new Date(user.metadata.creationTime)
        : null;

    const formattedCreationTime = creationTime
        ? creationTime.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Unknown";

    const handleUserPhoto = async () => {
        if (!user || !userPhoto) return;

        try {
            const storage = getStorage();
            const fileName = `profilePhotos/${user.uid}.jpg`;
            const storageRef = ref(storage, fileName);

            // Check if the current photo URL exists and matches the file in storage
            if (user.photoURL) {
                const currentPhotoRef = ref(storage, user.photoURL);

                try {
                    await deleteObject(currentPhotoRef);
                } catch (deleteError) {
                    console.error("No existing photo to delete or failed to delete", deleteError);
                }
            }

            const response = await fetch(userPhoto);
            const blob = await response.blob();

            // const mimeType = blob.type || "image/jpeg";

            // Upload the image with the correct MIME type
            await uploadBytes(storageRef, blob, {
                contentType: "image/jpeg",
            });

            const photoURL = await getDownloadURL(storageRef);

            await updateProfile(user, { photoURL });

            setUserPhoto(photoURL);
        } catch (error) {
            console.error("Error updating photo:", error);
            Alert.alert("Error", "Failed to update the photo. Please try again.", [{ text: "OK" }]);
        }
    };

    const handlePickImage = async () => {
        await pickImage(setUserPhoto, requestGalleryPermission);
        await handleUserPhoto();
    };
    
//TODO: MOVE TO MODAL MENU
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView className="bg-primary dark:bg-secondary h-full w-full font-Josefin pt-12">
            <View className="absolute top-10 right-2">
                <TouchableOpacity onPress={router.back} className="p-4">
                    <FontAwesomeIcon icon={faGear} style={reverseIconStyle} size={28} />
                </TouchableOpacity>
            </View>
            <View className="px-4 my-6 justify-center items-center gap-6">
                <TouchableOpacity
                    onPress={handlePickImage}
                    className="bg-secondary/90 dark:bg-primary/90 rounded-full w-40 h-40 justify-center items-center overflow-hidden"
                >
                    {user?.photoURL ? (
                        <Image
                            source={{ uri: user.photoURL }}
                            className="w-full h-full border rounded-full border-secondary dark:border-primary"
                            resizeMode="cover"
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faCameraRetro}
                            size={40}
                            style={dynamicIconStyle}
                        />
                    )}
                </TouchableOpacity>
                <View className="gap-1">
                    <Text className='text-secondary dark:text-primary text-center text-xl font-semibold uppercase tracking-widest'>
                        {user?.displayName
                            ? user?.displayName
                            : 'Welcome to INDUMENTA'
                        }
                    </Text>
                    <Text className='text-center text-secondary/80 dark:text-primary/80 uppercase text-xs tracking-wider'>
                        Joined {formattedCreationTime}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Profile;
