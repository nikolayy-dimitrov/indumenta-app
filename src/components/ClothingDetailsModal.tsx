import { View, Text, Modal, Image, TouchableOpacity, useColorScheme } from "react-native";
import { ClothingItem } from "@/app/(tabs)/wardrobe";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface ClothingDetailModalProps {
    item: ClothingItem | null;
    isVisible: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
}

const ClothingDetailModal = ({ item, isVisible, onClose, onDelete }: ClothingDetailModalProps) => {
    if (!item) return null;

    const formattedDate = new Date(item.uploadedAt.toMillis()).toLocaleDateString("en-GB");

    const colorScheme = useColorScheme();
    const dynamicIconStyle = {
        color: colorScheme === "dark" ? "#F8E9D5" : "#181819",
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
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-2xl font-bold text-secondary dark:text-primary capitalize">
                            {item.category}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesomeIcon icon={faXmark} size={24} style={dynamicIconStyle} />
                        </TouchableOpacity>
                    </View>

                    <Image
                        source={{ uri: item.imageUrl }}
                        className="w-full h-96 rounded-xl mb-4"
                        resizeMode="cover"
                    />

                    <View className="gap-2">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg text-secondary/90 dark:text-primary/90">Category</Text>
                            <Text className="text-lg text-secondary/80 dark:text-primary/80 capitalize">
                                {item.category}
                            </Text>
                        </View>

                        {item.subCategory && (
                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg text-secondary/90 dark:text-primary/90">Subcategory</Text>
                                <Text className="text-lg text-secondary/80 dark:text-primary/80 capitalize">
                                    {item.subCategory}
                                </Text>
                            </View>
                        )}

                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg text-secondary/90 dark:text-primary/90">Color</Text>
                            <View
                                style={{ backgroundColor: item.dominantColor }}
                                className="w-6 h-6 rounded"
                            />
                        </View>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg text-secondary/90 dark:text-primary/90">Added on</Text>
                            <Text className="text-lg text-secondary/80 dark:text-primary/80">
                                {formattedDate}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => onDelete(item.id)}
                        className="bg-red-400 dark:bg-red-500 rounded-xl py-4 mt-8"
                    >
                        <Text className="text-center text-white font-bold text-lg">
                            Remove from Wardrobe
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ClothingDetailModal;