import React, { useContext, useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "@/context/AuthContext.tsx";
import { useActionSheet } from "@expo/react-native-action-sheet";

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
    const cancelButtonIndex = 5;

    showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          title: "Select a Color Scheme",
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
      "Sport/Athletic",
      "Party/Night Out",
      "Cancel",
    ];
    const cancelButtonIndex = 5;

    showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          title: "Select an Occasion",
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
      <View className="flex justify-center items-center h-screen font-Josefin">
        <Text>Please log in to continue.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
        <View className="flex justify-center items-center h-screen font-Josefin">
          <Text className="text-primary">Loading</Text>
        </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center font-Josefin">
      <Text className="absolute text-2xl font-semibold top-12 text-secondary dark:text-primary">
        Style Preferences
      </Text>

      <View className="mt-10 w-10/12">
        <TouchableOpacity
            onPress={onColorOptionsPress}
            className="bg-content py-3 px-4 rounded mb-4"
        >
          <Text className="text-center text-secondary font-medium">
            {stylePreferences.color || "Select Color Preference"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={onOccasionOptionsPress}
            className="bg-content py-3 px-4 rounded"
        >
          <Text className="text-center text-secondary font-medium">
            {stylePreferences.occasion || "Select Occasion"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mt-6 w-10/12">
        <TouchableOpacity
          onPress={onBack}
          className="flex-1 bg-secondary dark:bg-primary py-2 px-4 mr-2 rounded"
        >
          <Text className="text-center my-auto text-primary dark:text-secondary font-medium">
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNext}
          className="flex-1 bg-content py-3 px-4 ml-2 rounded"
        >
          <Text className="text-center text-secondary font-medium">
            Generate Outfit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StyleSelection;
