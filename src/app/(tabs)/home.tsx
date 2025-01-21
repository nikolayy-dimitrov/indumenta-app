import { SafeAreaView, View, Text, TouchableOpacity, ImageBackground, Image, FlatList } from "react-native";
import React, {useContext} from "react";
import { router } from "expo-router";

import { ViewMode } from "@/types/wardrobe.ts";
import { useScheduledOutfits, useTrendingOutfits } from "@/hooks/useWardrobe.ts";
import LoadingScreen from "@/components/LoadingScreen.tsx";
import { AuthContext } from "@/context/AuthContext.tsx";
import { useModal } from "@/hooks/useModal.ts";
import { useItemOptions } from "@/hooks/useItemOptions.ts";
import OutfitDetailsModal from "@/components/OutfitDetailsModal.tsx";

const Home = () => {
    const { user } = useContext(AuthContext);
    const { trendingOutfits, isLoading: trendingLoading, setTrendingOutfits } = useTrendingOutfits(6); // Fetch first 6 returned outfits
    const { scheduledOutfits, isLoading: scheduleLoading, setScheduledOutfits } =
        useScheduledOutfits(user?.uid || '');

    const {
        selectedOutfitItem,
        isOutfitModalVisible,
        openOutfitModal,
        closeModals
    } = useModal();

    const { confirmDelete } = useItemOptions({
        setTrendingOutfits,
        onClose: closeModals
    });

    const shouldShowModal = isOutfitModalVisible &&
        selectedOutfitItem &&
        user?.uid;

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
                {trendingLoading ? (
                    <LoadingScreen />
                ) : (
                    <FlatList
                        data={trendingOutfits}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => openOutfitModal(item)}
                                className="mr-4 flex-1 items-center justify-center w-44 h-44"
                            >
                                <Image
                                    source={{ uri: item.outfitPieces.Top }}
                                    className="w-full h-1/3 rounded-t-xl"
                                    resizeMode="cover"
                                />
                                <Image
                                    source={{ uri: item.outfitPieces.Bottom }}
                                    className="w-full h-1/3"
                                    resizeMode="cover"
                                />
                                <Image
                                    source={{ uri: item.outfitPieces.Shoes }}
                                    className="w-full h-1/3 rounded-b-xl"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
            {scheduledOutfits.length > 0 ? (
                <View className="flex-1 p-4 gap-4">
                    <Text className="uppercase tracking-wider text-secondary dark:text-primary text-lg font-medium">
                        Scheduled Outfits
                    </Text>
                    {scheduleLoading ? (
                        <LoadingScreen />
                    ) : (
                        <FlatList
                            data={scheduledOutfits}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => {
                                const date = item.scheduledDate?.toDate(); // Convert Timestamp to Date
                                const day = date!.getDate(); // Get the day
                                const month = date!.toLocaleString("en-US", { month: "short" }) // Format as a short month

                                return (
                                <TouchableOpacity
                                    onPress={() => openOutfitModal(item)}
                                    className="mr-2 flex-1 w-28 h-28 items-center justify-center border border-secondary dark:border-primary rounded-xl"
                                >
                                    <Text className="text-secondary dark:text-primary font-semibold text-4xl">{day}</Text>
                                    <Text className="text-secondary dark:text-primary font-medium text-lg">{month}</Text>
                                </TouchableOpacity>

                            )}}
                        />
                        )}
                </View>
                ) : null
            }

            {shouldShowModal && (
                <OutfitDetailsModal
                    item={selectedOutfitItem}
                    isVisible={isOutfitModalVisible}
                    onClose={closeModals}
                    onDelete={(itemId) => confirmDelete(itemId, 'outfits')}
                    currentUserId={user!.uid}
                    isOwner={user.uid === selectedOutfitItem.userId}
                />
            )}
        </SafeAreaView>
    )
}

export default Home;
