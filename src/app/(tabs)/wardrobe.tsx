import { View, Text, Image, FlatList, Alert, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { collection, query, where, Timestamp, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/../firebaseConfig.ts";

import { AuthContext } from "@/context/AuthContext.tsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ClothingDetailModal from "@/components/ClothingDetailsModal.tsx";
import LoadingScreen from "@/components/LoadingScreen.tsx";

export interface ClothingItem {
    id: string;
    imageUrl: string;
    dominantColor: string;
    uploadedAt: Timestamp;
    userId: string;
    category: string;
    subCategory: string;
}

type SortOption = "newest" | "oldest" | "color";

const Wardrobe = () => {
    const { user, isLoading, setIsLoading } = useContext(AuthContext);
    const [clothes, setClothes] = useState<ClothingItem[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { showActionSheetWithOptions } = useActionSheet();

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const clothesRef = collection(db, "clothes");
        const q = query(clothesRef, where("userId", "==", user.uid));

        // Real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const clothesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    imageUrl: data.imageUrl,
                    dominantColor: data.dominantColor,
                    uploadedAt: data.uploadedAt,
                    userId: data.userId,
                    category: data.category,
                    subCategory: data.subCategory
                };
            });

            setClothes(clothesData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching clothes:", error);
            setIsLoading(false);
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, [user]);

    const handleItemPress = (item: ClothingItem) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    const deleteItem = async (itemId: string) => {
        try {
            const itemDocRef = doc(db, "clothes", itemId);
            await deleteDoc(itemDocRef);

            setClothes(prevClothes => prevClothes.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const confirmDelete = (itemId: string) => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to remove this item?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => {
                        deleteItem(itemId);
                        handleCloseModal();
                    }, }
            ]
        );
    };

    const sortClothes = (items: ClothingItem[]): ClothingItem[] => {
        switch (sortBy) {
            case "newest":
                return [...items].sort(
                    (a, b) => b.uploadedAt.toMillis() - a.uploadedAt.toMillis()
                );
            case "oldest":
                return [...items].sort(
                    (a, b) => a.uploadedAt.toMillis() - b.uploadedAt.toMillis()
                );
            case "color":
                return [...items].sort((a, b) =>
                    (a.dominantColor || '').localeCompare(b.dominantColor || '')
                );
            default:
                return items;
        }
    };

    const handleSortOptions = () => {
        const options = ["Newest First", "Oldest First", "Color", "Cancel"];
        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                cancelButtonTintColor: '#d32f2f',
                destructiveButtonIndex: cancelButtonIndex,
                showSeparators: true,
                separatorStyle: {
                    width: '100%',
                    backgroundColor: 'rgba(24,24,25,0.2)',
                    height: 1,
                    marginLeft: 0,
                    marginRight: 0,
                },
                containerStyle: {
                    alignItems: "center", justifyContent: "center",
                    borderRadius: 10,
                    margin: 10,
                    backgroundColor: '#F8E9D5',
                    opacity: 0.96,
                },
                textStyle: {
                    textAlign: "center",
                    color: "rgba(24,24,25,0.81)",
                    width: '100%',
                    alignSelf: 'center',
                },
            },
            (buttonIndex) => {
                if (buttonIndex === 0) {
                    setSortBy("newest");
                } else if (buttonIndex === 1) {
                    setSortBy("oldest");
                } else if (buttonIndex === 2) {
                    setSortBy("color");
                }
            }
        );
    };

    const sortedClothes = sortClothes(clothes);

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center h-full font-Josefin bg-primary dark:bg-secondary">
                <Text className="font-Josefin text-primary dark:text-primary">Please log in to view your wardrobe.</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <SafeAreaView className="px-6 bg-primary dark:bg-secondary font-Josefin h-screen">
            <Text className="uppercase text-2xl font-bold mb-4 text-secondary dark:text-primary">
                Wardrobe
            </Text>
            <TouchableOpacity onPress={handleSortOptions} className="bg-secondary/90 dark:bg-primary/85 rounded-md p-2 my-2">
                <Text className="uppercase w-full text-center font-medium text-lg text-primary/80 dark:text-secondary/80">{sortBy}</Text>
            </TouchableOpacity>
            <FlatList
                data={sortedClothes}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleItemPress(item)} className="bg-secondary/5 dark:bg-primary/5 pb-4 rounded-xl gap-4 mx-1 my-2">
                        <Image
                            source={{ uri: item.imageUrl }}
                            className="w-44 h-44 rounded-t-xl"
                        />
                        <View className="px-3 gap-2 flex-row items-center">
                            <Text className="lowercase font-medium text-base text-secondary/90 dark:text-primary/90">
                                {item.category}
                            </Text>
                            <View
                                style={{ backgroundColor: item.dominantColor }}
                                className="w-4 h-4 rounded"
                            ></View>
                        </View>
                        {/*<TouchableOpacity*/}
                        {/*    onPress={() => confirmDelete(item.id)}*/}
                        {/*    className="p-2"*/}
                        {/*>*/}
                        {/*    <Text className="text-secondary font-semibold">Remove</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View className="flex-1 h-full items-center justify-center py-32">
                        <Text className="text-gray-500">No clothes found in your wardrobe.</Text>
                    </View>
                }
            />
            <ClothingDetailModal
                item={selectedItem}
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onDelete={confirmDelete}
            />
        </SafeAreaView>
    );
};

export default Wardrobe;
