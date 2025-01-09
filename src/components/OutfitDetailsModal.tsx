import { View, Text, Modal, Image, TouchableOpacity, useColorScheme, TextInput, Animated } from "react-native";
import { OutfitItem } from "@/app/(tabs)/wardrobe";
import { faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState } from "react";
import { db } from "@/firebaseConfig.ts";
import { doc, updateDoc } from "firebase/firestore";
import usePanDraggable from "@/hooks/usePanDraggable.ts";

interface OutfitDetailsModalProps {
    item: OutfitItem | null;
    isVisible: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
}

const OutfitDetailsModal = ({ item, isVisible, onClose, onDelete }: OutfitDetailsModalProps) => {
    if (!item) return null;

    const { panResponder, translateY } = usePanDraggable(onClose);

    const [newLabel, setNewLabel] = useState<string>(item?.label || "");
    const [editLabel, setEditLabel] = useState<boolean>(false);

    const colorScheme = useColorScheme();
    const dynamicIconStyle = {
        color: colorScheme === "light" ? "#F8E9D5" : "#181819",
    };

    const toggleEditLabel = (label: boolean) => {
        setEditLabel(!label);
    }

    // Update label in Firestore
    const handleLabelChange = async () => {
        if (!item) return;

        if (newLabel !== item?.label) {
            try {
                const outfitRef = doc(db, "outfits", item.id);
                await updateDoc(outfitRef, { label: newLabel });
                setEditLabel(false);
            } catch (error) {
                console.error("Error updating label:", error);
            }
        } else {
            setEditLabel(false);
        }
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
                        <View className="flex-row justify-between items-center mb-8 pb-8">
                            <TouchableOpacity
                                onPress={() => toggleEditLabel(editLabel)}
                                className="mb-2">
                                {editLabel ? (
                                    <View className="flex-row items-center gap-4">
                                        <TextInput
                                            value={newLabel}
                                            onChangeText={setNewLabel}
                                            className="text-primary dark:text-secondary text-xl font-semibold"
                                        />
                                        <TouchableOpacity onPress={handleLabelChange}>
                                            <FontAwesomeIcon icon={faCircleCheck} style={dynamicIconStyle} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Text className="text-primary dark:text-secondary text-center text-xl font-semibold uppercase tracking-wide">
                                        {item?.label || 'OUTFIT LABEL'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onClose}
                                className="p-2 rounded-3xl bg-secondary/60 dark:bg-primary/60"
                            >
                                <FontAwesomeIcon icon={faXmark} size={20} style={dynamicIconStyle} />
                            </TouchableOpacity>
                        </View>
                        <View className="w-full h-1/2 flex-col items-center justify-center mx-auto">
                            <Image
                                source={{ uri: item.outfitPieces.Top }}
                                className="w-1/2 h-1/3 mb-4"
                                resizeMode="contain"
                            />
                            <Image
                                source={{ uri: item.outfitPieces.Bottom }}
                                className="w-1/2 h-1/3 mb-4"
                                resizeMode="contain"
                            />
                            <Image
                                source={{ uri: item.outfitPieces.Shoes }}
                                className="w-1/2 h-1/3 mb-4"
                                resizeMode="contain"
                            />
                        </View>

                        <View className="mt-8 gap-1">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg text-primary/90 dark:text-secondary/90 lowercase">
                                    Match:
                                </Text>
                                <Text className="text-lg text-primary/80 dark:text-secondary/80">
                                    {item.match}%
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg text-primary/90 dark:text-secondary/90 lowercase">
                                    Preferences:
                                </Text>
                                <View>
                                    {item.stylePreferences.color && (
                                        <Text className="text-right text-md text-primary/80 dark:text-secondary/80 lowercase">
                                            {item.stylePreferences.color}
                                        </Text>
                                    )}
                                    {item.stylePreferences.occasion && (
                                        <Text className="text-right text-md text-primary/80 dark:text-secondary/80 lowercase">
                                            {item.stylePreferences.occasion}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => onDelete(item.id)}
                            className="bg-red-500 dark:bg-red-600 rounded-xl py-4 my-auto"
                        >
                            <Text className="text-center text-white font-bold text-lg uppercase">
                                Remove from Wardrobe
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default OutfitDetailsModal;