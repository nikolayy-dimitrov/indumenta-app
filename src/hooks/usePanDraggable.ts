import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

const usePanDraggable = (onClose: () => void) => {
    const translateY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (event, gestureState) => {
                if (gestureState.dy > 100) {
                    Animated.timing(translateY, {
                        toValue: 1000,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => onClose());
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return { panResponder, translateY };
};

export default usePanDraggable;
