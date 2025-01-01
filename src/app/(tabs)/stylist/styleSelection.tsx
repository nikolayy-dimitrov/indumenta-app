import React from 'react';
import { View, Text, Button } from 'react-native';

interface StyleSelectionProps {
    onBack: () => void;
    onNext: () => void;
}

const StyleSelection: React.FC<StyleSelectionProps> = ({ onBack, onNext }) => {
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-2xl mb-4">Select Your Style</Text>
            {/* Add your style selection logic here */}
            <View className="flex-row">
                <Button
                    title="Back"
                    onPress={onBack}
                />
                <Button
                    title="Next: Outfit Display"
                    onPress={onNext}
                />
            </View>
        </View>
    );
};

export default StyleSelection;