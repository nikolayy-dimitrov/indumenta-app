import React, { useState } from "react";
import {View, Text, Image, TouchableOpacity, ScrollView, useColorScheme} from "react-native";
import {faAngleLeft, faCircleLeft, faCircleRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton.tsx";

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

    const colorScheme = useColorScheme();
    const dynamicIconStyle = {
        color: colorScheme === "dark" ? "#F8E9D5" : "#181819",
    };

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
                    className="w-full bg-secondary dark:bg-primary py-2 px-4 rounded"
                >
                    <Text className="text-primary dark:text-secondary text-center font-bold">
                        Back to Style Selection
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView className="h-full w-full">
            <View className="absolute top-0 left-2">
                <TouchableOpacity
                    onPress={onBack}
                    className="p-4 flex-row items-center gap-2"
                >
                    <FontAwesomeIcon icon={faAngleLeft} size={20} style={dynamicIconStyle} />
                    <Text className="text-secondary dark:text-primary text-center font-semibold">
                        Back
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="p-4">
                <View className="space-y-4">
                    {Object.entries(currentOutfit.outfit_pieces).map(
                        ([pieceType, itemId]) => (
                            <View
                                key={`${currentOutfit.outfit_id}-${pieceType}`}
                                className="flex items-center mb-4 w-full bg-secondary dark:bg-primary rounded-lg p-6"
                            >
                                <Image
                                    source={{ uri: itemId }}
                                    className="w-24 h-24 rounded-md"
                                    resizeMode="cover"
                                />
                                <View className="mt-2">
                                    <Text className="text-center text-primary/90 dark:text-secondary/90 font-medium text-lg">
                                        {pieceType}
                                    </Text>
                                </View>
                            </View>
                        )
                    )}
                </View>

                <View className="flex-row justify-between items-center w-10/12 mx-auto mt-6">
                    <TouchableOpacity
                        onPress={handlePrevious}
                    >
                        <FontAwesomeIcon icon={faCircleLeft} size={32} style={dynamicIconStyle} />
                    </TouchableOpacity>
                    <Text className="text-3xl font-bold text-secondary dark:text-primary">{currentOutfit.outfit_id}</Text>
                    <TouchableOpacity
                        onPress={handleNext}
                    >
                        <FontAwesomeIcon icon={faCircleRight} size={32} style={dynamicIconStyle} />
                    </TouchableOpacity>
                </View>
                <View className="items-center">
                    <Text className="text-secondary/60 dark:text-primary/60">Match: {currentOutfit.match}%</Text>
                </View>
            </View>
            {/* TODO:Add a button to save outfit to user database */}
        </SafeAreaView>
    );
};

export default OutfitDisplayScreen;
