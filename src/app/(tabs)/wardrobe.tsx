import { View, Text, Image, FlatList, Alert, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";

import { collection, query, where, Timestamp, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/../firebaseConfig.ts";

import { AuthContext } from "@/context/AuthContext.tsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActionSheet } from "@expo/react-native-action-sheet";

interface ClothingItem {
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
                { text: "Delete", style: "destructive", onPress: () => deleteItem(itemId) }
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
                destructiveButtonIndex: cancelButtonIndex,
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
            <View className="flex-1 justify-center items-center h-full font-Josefin">
                <Text>Please log in to view your wardrobe.</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center h-full font-Josefin">
                <Text>Loading your wardrobe...</Text>
            </View>
        );
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
                    <View className="bg-secondary/5 dark:bg-primary/5 pb-4 rounded-xl gap-4 mx-1 my-2">
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
                    </View>
                )}
                ListEmptyComponent={
                    <View className="flex-1 h-full items-center justify-center py-32">
                        <Text className="text-gray-500">No clothes found in your wardrobe.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default Wardrobe;
