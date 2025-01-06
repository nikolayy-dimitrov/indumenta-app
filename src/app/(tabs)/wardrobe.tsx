import { View, Text, Image, FlatList, Alert, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";

import { collection, query, where, Timestamp, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/../firebaseConfig.ts";

import { AuthContext } from "@/context/AuthContext.tsx";
import { SafeAreaView } from "react-native-safe-area-context";

interface ClothingItem {
    id: string;
    imageUrl: string;
    dominantColor: string;
    uploadedAt: Timestamp;
    userId: string;
    category: string;
}

type SortOption = "newest" | "oldest" | "color";

const Wardrobe = () => {
    const { user } = useContext(AuthContext);
    const [clothes, setClothes] = useState<ClothingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("newest");

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
                    category: data.category
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

    const sortedClothes = sortClothes(clothes);

    return (
        <SafeAreaView className="flex-1 px-4 pt-12 bg-primary dark:bg-secondary h-screen font-Josefin">
            <Text className="text-2xl font-bold mb-4 text-secondary dark:text-primary">Your Wardrobe</Text>

            <FlatList
                data={sortedClothes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        className="mb-4 flex flex-row items-center border border-primary rounded-xl p-4 dark:bg-primary/80 bg-secondary/10"
                    >
                        <Image
                            source={{ uri: item.imageUrl }}
                            className="w-24 h-24 rounded-xl"
                        />
                        <View className="ml-4 flex-1">
                            <Text className="font-medium text-base">{item.category}</Text>
                            <Text className="text-sm text-gray-600">
                                Uploaded: {new Date(item.uploadedAt.toMillis()).toLocaleDateString()}
                            </Text>
                            <View className="flex flex-row items-center">
                                <Text className="text-sm text-gray-600">Color: </Text>
                                <View
                                    style={{ backgroundColor: item.dominantColor }}
                                    className="w-4 h-4 ml-2 rounded"
                                ></View>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => confirmDelete(item.id)}
                            className="p-2"
                        >
                            <Text className="text-secondary font-semibold">Remove</Text>
                        </TouchableOpacity>
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
