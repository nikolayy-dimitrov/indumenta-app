import { View, Text, Modal, Image, TouchableOpacity, useColorScheme, Animated } from "react-native";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import usePanDraggable from "@/hooks/usePanDraggable.ts";
import React from "react";
import { ClothingItem } from "@/types/wardrobe.ts";

interface ClothingDetailsModalProps {
    item: ClothingItem | null;
    isVisible: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
}

const ClothingDetailsModal = ({ item, isVisible, onClose, onDelete }: ClothingDetailsModalProps) => {
    if (!item) return null;

    const { panResponder, translateY } = usePanDraggable(onClose);

    const formattedDate = new Date(item.uploadedAt.toMillis()).toLocaleDateString("en-GB");

    const colorScheme = useColorScheme();
    const dynamicIconStyle = {
        color: colorScheme === "light" ? "#F8E9D5" : "#181819",
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                <Animated.View
                    style={{
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 0,
                        height: '80%',
                        transform: [{ translateY }],
                    }}
                    {...panResponder.panHandlers}
                >
                    <View className="bg-secondary/80 dark:bg-primary/90 rounded-3xl p-6 m-2">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-2xl font-bold text-primary dark:text-secondary capitalize">
                                {item.category}
                            </Text>
                            <TouchableOpacity
                                onPress={onClose}
                                className="p-2 rounded-3xl bg-secondary dark:bg-primary/60"
                            >
                                <FontAwesomeIcon icon={faXmark} size={20} style={dynamicIconStyle} />
                            </TouchableOpacity>
                        </View>

                        <Image
                            source={{ uri: item.imageUrl }}
                            className="w-full h-96 rounded-xl mb-4"
                            resizeMode="cover"
                        />

                        <View className="gap-2">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg text-primary/90 dark:text-secondary/90">Category</Text>
                                <Text className="text-lg text-primary/80 dark:text-secondary/80 capitalize">
                                    {item.category}
                                </Text>
                            </View>

                            {item.subCategory && (
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-lg text-primary/90 dark:text-secondary/90">Subcategory</Text>
                                    <Text className="text-lg text-primary/80 dark:text-secondary/80 capitalize">
                                        {item.subCategory}
                                    </Text>
                                </View>
                            )}

                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg text-primary/90 dark:text-secondary/90">Color</Text>
                                <View
                                    style={{ backgroundColor: item.dominantColor }}
                                    className="w-6 h-6 rounded"
                                />
                            </View>

                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg text-primary/90 dark:text-secondary/90">Added on</Text>
                                <Text className="text-lg text-primary/80 dark:text-secondary/80">
                                    {formattedDate}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => onDelete(item.id)}
                            className="bg-red-500 dark:bg-red-600 rounded-xl py-4 my-auto"
                        >
                            <Text className="text-center text-white font-bold text-lg">
                                Remove from Wardrobe
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default ClothingDetailsModal;