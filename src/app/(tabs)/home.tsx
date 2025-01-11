import { SafeAreaView, View, Text, TouchableOpacity, ImageBackground } from "react-native";
import React from "react";
import { router } from "expo-router";

import { ViewMode } from "@/types/wardrobe.ts";

const Home = () => {
    const handleWardrobeNavigation = (viewMode: ViewMode) => {
        router.push({
            pathname: '/wardrobe',
            params: { viewMode }
        });
    };

    return (
        <SafeAreaView className="bg-primary dark:bg-secondary h-full w-full font-Josefin pt-16">
            {/* Header / Logo */}
            <View className='w-11/12 mx-auto border-b border-secondary/20 dark:border-primary/10 pb-4'>
                <Text className="font-bold tracking-widest text-center text-secondary/90 dark:text-primary/80 text-4xl">
                    INDUMENTA
                </Text>
            </View>
            {/* CTA Buttons */}
            <View className="flex-row items-center justify-center p-4 gap-4 mt-2">
                <TouchableOpacity
                    onPress={() => router.push('/stylist')}
                    className="bg-secondary w-32 h-32 rounded-lg overflow-hidden">
                    <ImageBackground
                        source={require('assets/CraftWardrobe.jpg')}
                        resizeMode="cover"
                        className="flex-1 opacity-60"
                    ></ImageBackground>
                    <Text className="lowercase tracking-wide text-primary text-semibold
                    absolute bottom-0 right-0 py-1 px-2">
                        Craft
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleWardrobeNavigation('clothes')}
                    className="bg-secondary w-32 h-32 rounded-lg overflow-hidden">
                    <ImageBackground
                        source={require('assets/ExploreWardrobe.jpg')}
                        resizeMode="cover"
                        className="flex-1 opacity-60"
                    ></ImageBackground>
                    <Text className="lowercase tracking-wide text-primary text-semibold
                    absolute bottom-0 right-0 py-1 px-2">
                        Explore
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleWardrobeNavigation('outfits')}
                    className="bg-secondary w-32 h-32 rounded-lg overflow-hidden">
                    <ImageBackground
                        source={require('assets/MatchWardrobe.jpg')}
                        resizeMode="cover"
                        className="flex-1 opacity-60"
                    ></ImageBackground>
                    <Text className="lowercase tracking-wide text-primary text-semibold
                    absolute bottom-0 right-0 py-1 px-2">
                        Match
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Community outfits display */}
            <View className="flex-1 p-4 gap-4 mt-2">
                <Text className="uppercase tracking-wider text-secondary dark:text-primary text-lg font-medium">
                    Trending Outfits
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default Home;
