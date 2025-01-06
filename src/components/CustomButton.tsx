import { TouchableOpacity, useColorScheme, View } from "react-native";
import { Text } from 'react-native';
import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface CustomButtonProps {
    title?: string,
    icon?: IconProp,
    handlePress: () => void,
    containerStyles?: string,
    textStyles?: string,
    isLoading?: boolean,
    disabled?: boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       title,
                                                       icon,
                                                       handlePress,
                                                       containerStyles = "",
                                                       textStyles = "",
                                                       isLoading = false,
                                                       disabled
                                                   }) => {
    const colorScheme = useColorScheme();

    const dynamicIconStyle = {
        color: colorScheme === "light" ? "#F8E9D5" : "#181819",
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            className={`bg-secondary dark:bg-primary 
                rounded-xl py-3 justify-center items-center flex-row 
                ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
            disabled={isLoading || disabled}
        >
            {icon && (
                    <FontAwesomeIcon
                        icon={icon}
                        style={dynamicIconStyle}
                        size={16}
                    />
            )}
            {title && (
                <Text
                    className={`text-primary dark:text-secondary font-semibold text-lg ${textStyles}`}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default CustomButton;
