import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    useSharedValue,
} from 'react-native-reanimated';

interface LoadingScreenProps {
    showLogo?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
                                                         showLogo = true,
                                                     }) => {
    const translateY = useSharedValue(0);

   useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(-20, { duration: 1000 }),
                withTiming(10, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <View className="flex-1 items-center justify-center bg-primary dark:bg-secondary">
        {showLogo && (
                <Animated.View style={animatedStyle} className="mb-8">
                    {/* Replace with your app logo */}
                    <View className="w-32 h-32 p-2 rounded-2xl bg-secondary dark:bg-primary items-center justify-center">
                        <Text className="text-md font-bold text-center text-primary dark:text-secondary">INDUMENTA</Text>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

export default LoadingScreen;