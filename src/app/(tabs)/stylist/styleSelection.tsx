import React, { useContext } from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "@/context/AuthContext.tsx";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { faAngleLeft, faCalendarDay, faPaintbrush, faPalette } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import LoadingScreen from "@/components/LoadingScreen.tsx";

interface StylePreferences {
  color: string;
  occasion: string;
}

interface StyleSelectionProps {
  stylePreferences: StylePreferences;
  onStyleChange: (field: keyof StylePreferences, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const StyleSelection: React.FC<StyleSelectionProps> = ({
  stylePreferences = { color: "", occasion: "" },
  onStyleChange,
  onBack,
  onNext,
}) => {
  const { user, isLoading } = useContext(AuthContext);

  const colorScheme = useColorScheme();
  const dynamicIconStyle = {
    color: colorScheme === "dark" ? "#F8E9D5" : "#181819",
  };

  const { showActionSheetWithOptions } = useActionSheet();

  const onColorOptionsPress = () => {
    const options = [
      "Monochrome",
      "Complementary Colors",
      "Neutral Tones",
      "Warm Colors",
      "Cool Colors",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
            cancelButtonTintColor: '#d32f2f',
            showSeparators: true,
            separatorStyle: {
                width: '100%',
                backgroundColor: 'rgba(24,24,25,0.2)',
                height: 1,
                marginLeft: 0,
                marginRight: 0,
            },
            containerStyle: {
                alignItems: "center", justifyContent: "center",
                borderRadius: 10,
                margin: 10,
                backgroundColor: '#F8E9D5',
                opacity: 0.96,
            },
          title: "Select a Color Scheme",
            titleTextStyle: {
                fontSize: 12,
                textAlign: "center",
            },
            textStyle: {
                textAlign: "center",
                color: "rgba(24,24,25,0.81)",
                width: '100%',
                alignSelf: 'center',
            },
        },
        (buttonIndex) => {
          if (buttonIndex !== undefined && buttonIndex !== cancelButtonIndex) {
            onStyleChange("color", options[buttonIndex]);
          }
        }
    );
  }

  const onOccasionOptionsPress = () => {
    const options = [
      "Casual",
      "Business",
      "Formal",
      "Sport",
      "Party",
      "Cancel",
    ];
      const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
            cancelButtonTintColor: '#d32f2f',
            showSeparators: true,
            separatorStyle: {
                width: '100%',
                backgroundColor: 'rgba(24,24,25,0.2)',
                height: 1,
                marginLeft: 0,
                marginRight: 0,
            },
            containerStyle: {
                alignItems: "center", justifyContent: "center",
                borderRadius: 10,
                margin: 10,
                backgroundColor: '#F8E9D5',
                opacity: 0.96,
            },
          title: "Select an Occasion",
            titleTextStyle: {
                fontSize: 12,
                textAlign: "center",
            },
            textStyle: {
                textAlign: "center",
                color: "rgba(24,24,25,0.81)",
                width: '100%',
                alignSelf: 'center',
            },
        },
        (buttonIndex) => {
          if (buttonIndex !== undefined && buttonIndex !== cancelButtonIndex) {
            onStyleChange("occasion", options[buttonIndex]);
          }
        }
    );
  };

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center h-full font-Josefin bg-primary dark:bg-secondary">
                <Text className="font-Josefin text-primary dark:text-primary">Please log in to continue.</Text>
            </View>
        );
    }

  if (isLoading) {
    return (
        <LoadingScreen />
    )
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center font-Josefin w-11/12 mx-auto">
      <View className="absolute top-0 left-0 w-full flex-row items-center gap-12">
        <TouchableOpacity onPress={onBack} className="p-4">
          <FontAwesomeIcon icon={faAngleLeft} size={20} style={dynamicIconStyle} />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-secondary dark:text-primary">
            Style Preferences
        </Text>
      </View>

      <View className="w-10/12 my-auto">
        <TouchableOpacity
            onPress={onColorOptionsPress}
            className="flex-row justify-center gap-2 bg-primary dark:bg-secondary p-4 rounded-lg border border-secondary/60 dark:border-primary/50 mb-4"
        >
          <FontAwesomeIcon icon={faPalette} style={dynamicIconStyle} />
          <Text className="text-secondary dark:text-primary font-medium">
            {stylePreferences.color || "Select Color Preference"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={onOccasionOptionsPress}
            className="flex-row justify-center gap-2 bg-primary dark:bg-secondary p-4 rounded-lg border border-secondary/60 dark:border-primary/50"
        >
          <FontAwesomeIcon icon={faCalendarDay} style={dynamicIconStyle} />
          <Text className="text-secondary dark:text-primary font-medium">
            {stylePreferences.occasion || "Select Occasion"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onNext}
        className="absolute bottom-0 flex-row w-full items-center justify-center gap-2 bg-content/80 p-4 rounded
                  border border-secondary/40 dark:border-primary/50"
      >
        <Text className="text-center text-secondary font-medium">
          Generate Outfit
        </Text>
        <FontAwesomeIcon icon={faPaintbrush} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default StyleSelection;
