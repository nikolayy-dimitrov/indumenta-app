import { SafeAreaView, View, Text, TouchableOpacity, ImageBackground, Image, FlatList } from "react-native";
import React from "react";
import { router } from "expo-router";

import { ViewMode } from "@/types/wardrobe.ts";
import { useTrendingOutfits } from "@/hooks/useWardrobe.ts";
import LoadingScreen from "@/components/LoadingScreen.tsx";

const Home = () => {
    const { trendingOutfits, isLoading } = useTrendingOutfits(6); // Fetch first 6 returned outfits

    const handleWardrobeNavigation = (viewMode: ViewMode) => {
        router.push(`/wardrobe?viewMode=${viewMode}`);
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
                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    <FlatList
                        data={trendingOutfits}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleWardrobeNavigation('outfits')}
                                className="bg-secondary/5 dark:bg-primary/5 pb-4 rounded-xl gap-4 my-2"
                            >
                                <View className="w-44 h-52 flex-col items-center justify-center">
                                    <Image
                                        source={{ uri: item.outfitPieces.Top }}
                                        className="w-full h-1/3 rounded-t-xl"
                                        resizeMode="contain"
                                    />
                                    <Image
                                        source={{ uri: item.outfitPieces.Bottom }}
                                        className="w-full h-1/3"
                                        resizeMode="contain"
                                    />
                                    <Image
                                        source={{ uri: item.outfitPieces.Shoes }}
                                        className="w-full h-1/3 rounded-b-xl"
                                        resizeMode="contain"
                                    />
                                </View>
                                <View className="px-3 gap-2 flex-row items-center">
                                    <Text className="lowercase font-medium text-sm text-secondary/80 dark:text-primary/80">
                                        {item.label || 'Trending outfit'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View className="flex-1 h-full items-center justify-center py-32">
                                <Text className="text-gray-500">No trending outfits found.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default Home;
