import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { collection, deleteDoc, doc, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/../firebaseConfig.ts";

import { AuthContext } from "@/context/AuthContext.tsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ClothingDetailsModal from "@/components/ClothingDetailsModal.tsx";
import LoadingScreen from "@/components/LoadingScreen.tsx";
import OutfitDetailsModal from "@/components/OutfitDetailsModal.tsx";

export interface ClothingItem {
    id: string;
    imageUrl: string;
    dominantColor: string;
    uploadedAt: Timestamp;
    userId: string;
    category: string;
    subCategory: string;
}

export interface OutfitItem {
    id: string;
    label: string;
    outfitPieces: { Top: string; Bottom: string; Shoes: string };
    createdAt: Timestamp;
    match: number;
    stylePreferences: { color: string; occasion: string };
}

type SortOption = "newest" | "oldest" | "color";
type ViewMode = "clothes" | "outfits";

const Wardrobe = () => {
    const { user, isLoading, setIsLoading } = useContext(AuthContext);
    const [clothes, setClothes] = useState<ClothingItem[]>([]);
    const [outfits, setOutfits] = useState<OutfitItem[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("clothes");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem | null>(null);
    const [isOutfitModalVisible, setIsOutfitModalVisible] = useState(false);

    const { showActionSheetWithOptions } = useActionSheet();

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchClothes = () => {
            const clothesRef = collection(db, "clothes");
            const q = query(clothesRef, where("userId", "==", user.uid));

            return onSnapshot(q, (querySnapshot) => {
                const clothesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as ClothingItem[];

                setClothes(clothesData);
                setIsLoading(false);
            });
        };

        const fetchOutfits = () => {
            const outfitsRef = collection(db, "outfits");
            const q = query(outfitsRef, where("userId", "==", user.uid));

            return onSnapshot(q, (querySnapshot) => {
                const outfitsData = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        outfitPieces: data.outfit_pieces,
                        createdAt: data.createdAt,
                        match: data.match,
                        label: data.label,
                        stylePreferences: data.stylePreferences,
                    } as OutfitItem;
                });

                setOutfits(outfitsData);
                setIsLoading(false);
            });
        };


        const unsubscribeClothes = fetchClothes();
        const unsubscribeOutfits = fetchOutfits();

        return () => {
            unsubscribeClothes();
            unsubscribeOutfits();
        };
    }, [user]);

    const handleToggleView = (mode: ViewMode) => {
        setViewMode(mode);
    };

    const handleItemPress = (item: ClothingItem | OutfitItem, type: "clothes" | "outfits") => {
        if (type === "clothes") {
            setSelectedItem(item as ClothingItem);
            setIsModalVisible(true);
        } else {
            setSelectedOutfit(item as OutfitItem);
            setIsOutfitModalVisible(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setIsOutfitModalVisible(false);
        setSelectedItem(null);
        setSelectedOutfit(null);
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
            <Text className="uppercase text-2xl font-bold my-4 text-secondary dark:text-primary">
                Wardrobe
            </Text>
            <View className="flex-row items-center justify-center w-full gap-4 mb-4">
                <TouchableOpacity
                    onPress={()=>handleToggleView('clothes')}
                    className={`border border-secondary dark:border-primary py-3 rounded w-1/2 
                    ${viewMode === 'clothes' && 'bg-secondary dark:bg-primary'}`}>
                    <Text className={`text-center 
                    ${viewMode === 'clothes' 
                        ? 'text-primary dark:text-secondary font-medium' 
                        : 'text-secondary dark:text-primary'
                    }`}>
                        Clothes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>handleToggleView('outfits')}
                    className={`border border-secondary dark:border-primary py-3 rounded w-1/2 
                    ${viewMode === 'outfits' && 'bg-secondary dark:bg-primary'}`}>
                    <Text className={`text-center 
                    ${viewMode === 'outfits' 
                        ? 'text-primary dark:text-secondary font-medium'
                        : 'text-secondary dark:text-primary'}`}>
                        Outfits
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Display clothes */}
            {viewMode === 'clothes' ? (
                <View className="flex-row justify-center">
                    <TouchableOpacity onPress={handleSortOptions} className="absolute bottom-6 z-10 w-1/2 mx-auto bg-secondary/80 dark:bg-primary/80 rounded-md p-2 mb-2">
                        <Text className="uppercase w-full text-center font-medium text-lg text-primary/80 dark:text-secondary/80">
                            {sortBy}
                        </Text>
                    </TouchableOpacity>
                    <FlatList
                        data={sortedClothes}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleItemPress(item, 'clothes')} className="bg-secondary/5 dark:bg-primary/5 pb-4 rounded-xl gap-4 mx-1 my-2">
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
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View className="flex-1 h-full items-center justify-center py-32">
                                <Text className="text-gray-500">No clothes found in your wardrobe.</Text>
                            </View>
                        }
                    />
                </View>
            ) : (
                // Display outfits
                <FlatList
                    data={outfits}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleItemPress(item, 'outfits')} className="bg-secondary/5 dark:bg-primary/5 pb-4 rounded-xl gap-4 mx-1 my-2">
                            <View className="w-44 h-52 flex-col items-center justify-center">
                                <Image
                                    source={{ uri: item.outfitPieces.Top }}
                                    className="w-full h-1/3 rounded-t-xl"
                                    resizeMode="contain"
                                />
                                <Image
                                    source={{ uri: item.outfitPieces.Bottom }}
                                    className="w-full h-1/3"
                                    resizeMode="contain"
                                />
                                <Image
                                    source={{ uri: item.outfitPieces.Shoes }}
                                    className="w-full h-1/3 rounded-b-xl"
                                    resizeMode="contain"
                                />
                            </View>
                            <TouchableOpacity className="px-3 gap-2 flex-row items-center">
                                <Text className="lowercase font-medium text-sm text-secondary/80 dark:text-primary/80">
                                    {item.label ? item.label : 'Label outfit'}
                                </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View className="flex-1 h-full items-center justify-center py-32">
                            <Text className="text-gray-500">No outfits found in your wardrobe.</Text>
                        </View>
                    }
                />
            )}
            {isModalVisible && selectedItem && viewMode === "clothes" && (
                <ClothingDetailsModal
                    item={selectedItem}
                    isVisible={isModalVisible}
                    onClose={handleCloseModal}
                    onDelete={confirmDelete}
                />
            )}

            {isOutfitModalVisible && selectedOutfit && viewMode === "outfits" && (
                <OutfitDetailsModal
                    item={selectedOutfit}
                    isVisible={isOutfitModalVisible}
                    onClose={handleCloseModal}
                    onDelete={confirmDelete}
                />
            )}
        </SafeAreaView>
    );
};

export default Wardrobe;
