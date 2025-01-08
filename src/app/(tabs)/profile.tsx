import { View, Text, TouchableOpacity, Image, useColorScheme, Alert, TextInput } from "react-native";
import React, { useContext, useState } from "react";
import { signOut, updateProfile } from "@firebase/auth";
import { auth } from "@/../firebaseConfig";
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthContext"
import { SafeAreaView } from "react-native-safe-area-context";
import {
    faCameraRetro,
    faCircleCheck,
    faHeadset,
    faRightFromBracket,
    faSwatchbook
} from "@fortawesome/free-solid-svg-icons";
import {faBell, faStar} from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { pickImage, requestGalleryPermission} from "@/utils/imagePickerUtils.ts";
import {faXTwitter} from "@fortawesome/free-brands-svg-icons";

const Profile = () => {
    const { user } = useContext(AuthContext);

    const [userPhoto, setUserPhoto] = useState<string | null>(user?.photoURL || null);
    const [newUsername, setNewUsername] = useState<string>(user?.displayName || '');
    const [editUsername, setEditUsername] = useState<boolean>(false);

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

    const toggleEditUsername = (username: boolean) => {
        setEditUsername(!username);
    }

    const handleUsernameChange = async () => {
        if (!user) return;

        if (newUsername !== user?.displayName) {
            try {
                await updateProfile(user, { displayName: newUsername });
                setEditUsername(false);
            } catch (error) {
                console.error("Error updating username:", error);
                Alert.alert("Error", "Failed to update username. Please try again.", [{ text: "OK" }]);
            }
        } else {
            setEditUsername(false);
        }
    };

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
            <View className="px-4 my-6 justify-center items-center gap-4">
                {/* User Photo */}
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
                {/* Username */}
                <View className="gap-1">
                    <TouchableOpacity
                        onPress={() => toggleEditUsername(editUsername)}
                        className="mb-2">
                        {editUsername ? (
                            <View className="flex-row items-center gap-4">
                                <TextInput
                                    value={newUsername}
                                    onChangeText={setNewUsername}
                                    className="text-secondary dark:text-primary
                                     border-b border-secondary/40 dark:border-primary/40
                                     px-2 w-1/2 mx-auto"
                                />
                                <TouchableOpacity onPress={handleUsernameChange}>
                                    <FontAwesomeIcon icon={faCircleCheck} style={reverseIconStyle} size={20} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text className="text-secondary dark:text-primary text-center text-xl font-semibold uppercase tracking-widest">
                                {user?.displayName || 'Welcome to INDUMENTA'}
                            </Text>
                        )}
                    </TouchableOpacity>
                    <Text className='text-center text-secondary/80 dark:text-primary/80 uppercase text-xs tracking-wider'>
                        Joined {formattedCreationTime}
                    </Text>
                </View>
            </View>
            <View className="w-11/12 mx-auto gap-2">
                <View className="border-b border-secondary/20 dark:border-primary/20">
                    <Text className="text-secondary/60 dark:text-primary/60 text-xs uppercase tracking-wider">
                        Preferences
                    </Text>
                    <View className="px-1">
                        <TouchableOpacity className="py-4 w-full flex-row items-center gap-4">
                            <FontAwesomeIcon icon={faBell} style={reverseIconStyle} size={24} />
                            <Text className="text-secondary dark:text-primary lowercase tracking-wide text-xl">
                                Notifications
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="py-4 w-full flex-row items-center gap-4">
                            <FontAwesomeIcon icon={faSwatchbook} style={reverseIconStyle} size={24} />
                            <Text className="text-secondary dark:text-primary lowercase tracking-wide text-xl">
                                Appearance
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text className="text-secondary/60 dark:text-primary/60 text-xs uppercase tracking-wider">
                        Resources
                    </Text>
                    <View className="px-1">
                        <TouchableOpacity className="py-4 w-full flex-row items-center gap-4">
                            <FontAwesomeIcon icon={faHeadset} style={reverseIconStyle} size={24} />
                            <Text className="text-secondary dark:text-primary lowercase tracking-wide text-xl">
                                Support
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="py-4 w-full flex-row items-center gap-4">
                            <FontAwesomeIcon icon={faStar} style={reverseIconStyle} size={24} />
                            <Text className="text-secondary dark:text-primary lowercase tracking-wide text-xl">
                                Rate Us
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="py-4 w-full flex-row items-center gap-4">
                            <FontAwesomeIcon icon={faXTwitter} style={reverseIconStyle} size={24} />
                            <Text className="text-secondary dark:text-primary lowercase tracking-wide text-xl">
                                Follow Us
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="px-1 my-2">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="py-4 w-full flex-row items-center gap-4">
                        <FontAwesomeIcon icon={faRightFromBracket} style={reverseIconStyle} size={24} />
                        <Text className="text-secondary dark:text-primary lowercase tracking-wider text-xl">
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Profile;
