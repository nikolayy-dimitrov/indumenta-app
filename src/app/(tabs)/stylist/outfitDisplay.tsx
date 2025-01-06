import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

interface OutfitRecommendation {
    outfit_id: string;
    outfit_pieces: {
        Top: string;
        Bottom: string;
        Shoes: string;
    };
    match: number;
}

interface OutfitDisplayScreenProps {
    outfit: OutfitRecommendation[];
    onBack: () => void;
}

const OutfitDisplayScreen: React.FC<OutfitDisplayScreenProps> = ({
                                                                     outfit,
                                                                     onBack,
                                                                 }) => {
    const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
    const currentOutfit = outfit[currentOutfitIndex];

    const handleNext = () => {
        setCurrentOutfitIndex((prev) => (prev + 1) % outfit.length);
    };

    const handlePrevious = () => {
        setCurrentOutfitIndex((prev) => (prev - 1 + outfit.length) % outfit.length);
    };

    if (!currentOutfit) {
        return (
            <View className="flex-1 justify-center items-center p-6">
                <Text className="text-2xl font-bold mb-4">No outfits generated</Text>
                <TouchableOpacity
                    onPress={onBack}
                    className="w-full bg-gray-500 py-2 px-4 rounded"
                >
                    <Text className="text-white text-center font-bold">
                        Back to Style Selection
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 p-4 mt-16">
            <View className="items-center mb-6">
                <Text className="text-3xl font-bold text-secondary dark:text-primary">{currentOutfit.outfit_id}</Text>
                <Text className="text-secondary/60 dark:text-primary/60">Match: {currentOutfit.match}%</Text>
            </View>

            <View className="space-y-4">
                {Object.entries(currentOutfit.outfit_pieces).map(
                    ([pieceType, itemId]) => (
                        <View
                            key={`${currentOutfit.outfit_id}-${pieceType}`}
                            className="flex items-center mb-4"
                        >
                            <Image
                                source={{ uri: itemId }}
                                className="w-24 h-24 rounded-md border border-secondary dark:border-primary"
                                resizeMode="cover"
                            />
                            <View className="bg-secondary/70 dark:bg-primary/80 rounded w-24 mt-2">
                                <Text className="text-center text-primary/90 dark:text-secondary/90 font-medium text-lg">
                                    {pieceType}
                                </Text>
                            </View>
                        </View>
                    )
                )}
            </View>

            <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                    onPress={handlePrevious}
                    className="flex-1 bg-secondary dark:bg-content/60 py-2 px-4 rounded mr-2"
                    disabled={outfit.length <= 1}
                >
                    <Text className="text-primary text-center font-bold">
                        Previous Outfit
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleNext}
                    className="flex-1 bg-secondary dark:bg-content/60 py-2 px-4 rounded ml-2"
                    disabled={outfit.length <= 1}
                >
                    <Text className="text-primary text-center font-bold">
                        Next Outfit
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={onBack}
                className="w-full bg-content/70 dark:bg-primary py-2 px-4 mt-4 rounded shadow-sm"
            >
                <Text className="text-secondary dark:text-secondary text-center font-semibold">
                    Back to Style Selection
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default OutfitDisplayScreen;
