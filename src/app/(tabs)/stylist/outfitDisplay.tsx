import React from 'react';
import { View, Text, Button } from 'react-native';

interface OutfitDisplayProps {
    onBack: () => void;
}

const OutfitDisplay: React.FC<OutfitDisplayProps> = ({ onBack }) => {
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-2xl mb-4">Your Outfit</Text>
            {/* Add your outfit display logic here */}
            <Button
                title="Back to Style Selection"
                onPress={onBack}
            />
        </View>
    );
};

export default OutfitDisplay;