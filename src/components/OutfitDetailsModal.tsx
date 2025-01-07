import { View, Text, Modal, Image, TouchableOpacity, useColorScheme, TextInput } from "react-native";
import { OutfitItem } from "@/app/(tabs)/wardrobe";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { db } from "@/firebaseConfig.ts";
import { doc, updateDoc } from "firebase/firestore";

interface OutfitDetailsModalProps {
    item: OutfitItem | null;
    isVisible: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
}

const OutfitDetailsModal = ({ item, isVisible, onClose, onDelete }: OutfitDetailsModalProps) => {
    const [label, setLabel] = useState(item!.label || "");

    if (!item) return null;

    const colorScheme = useColorScheme();
    const dynamicIconStyle = {
        color: colorScheme === "dark" ? "#F8E9D5" : "#181819",
    };

    // Update label in Firestore
    const handleSaveLabel = async () => {
        if (!item || !label.trim()) return;

        try {
            const outfitRef = doc(db, "outfits", item.id);
            await updateDoc(outfitRef, { label });
        } catch (error) {
            console.error("Error updating label:", error);
        } finally {
            onClose();
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
                <View className="bg-primary/95 dark:bg-secondary/95 rounded-t-2xl p-6 h-5/6">
                    <View className="flex-row justify-between items-center mb-8">
                        <TextInput
                            value={item.label}
                            onChangeText={setLabel}
                            placeholder="LABEL OUTFIT"
                            className="placeholder:text-secondary placeholder:dark:text-primary text-xl font-bold text-secondary dark:text-primary uppercase flex-1"
                        />
                        <TouchableOpacity
                            onPress={() => {
                                if (!label.trim() || label === item.label) {
                                    onClose(); // Close the modal if the label is empty or unchanged
                                } else {
                                    handleSaveLabel(); // Save the label if there's a valid change
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faXmark} size={24} style={dynamicIconStyle} />
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
                            <Text className="text-lg text-secondary/90 dark:text-primary/90 lowercase">
                                Match:
                            </Text>
                            <Text className="text-lg text-secondary/80 dark:text-primary/80">
                                {item.match}%
                            </Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg text-secondary/90 dark:text-primary/90 lowercase">
                                Preferences:
                            </Text>
                            <View>
                                {item.stylePreferences.color && (
                                    <Text className="text-right text-md text-secondary/80 dark:text-primary/80 lowercase">
                                        {item.stylePreferences.color}
                                    </Text>
                                )}
                                {item.stylePreferences.occasion && (
                                    <Text className="text-right text-md text-secondary/80 dark:text-primary/80 lowercase">
                                        {item.stylePreferences.occasion}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => onDelete(item.id)}
                        className="bg-red-400 dark:bg-red-500 rounded-xl py-4 my-auto"
                    >
                        <Text className="text-center text-white font-bold text-lg uppercase">
                            Remove from Wardrobe
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default OutfitDetailsModal;