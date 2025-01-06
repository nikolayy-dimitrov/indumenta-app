import React, { useContext, useState } from 'react';

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/../firebaseConfig";

import { BACKEND_URL } from "@env";

import Upload from './upload';
import StyleSelection from './styleSelection';
import OutfitDisplay from './outfitDisplay';

import { AuthContext } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

type StylistScreen = 'upload' | 'styleSelection' | 'outfitDisplay';

interface StylePreferences {
    color: string;
    occasion: string;
}

interface OutfitRecommendation {
    outfit_id: string;
    outfit_pieces: {
        Top: string;
        Bottom: string;
        Shoes: string;
    };
    match: number;
}

const StylistPage: React.FC = () => {
    const { user, isLoading, setIsLoading } = useContext(AuthContext);

    const [currentScreen, setCurrentScreen] = useState<StylistScreen>('upload');
    const [stylePreferences, setStylePreferences] = useState<StylePreferences>({
        color: '',
        occasion: ''
    });
    const [outfit, setOutfit] = useState<OutfitRecommendation[]>([]);

    const apiUrl = BACKEND_URL + '/api/generate-outfit';

    const navigateTo = (screen: StylistScreen) => {
        setCurrentScreen(screen);
    };

    // Handle style preference changes
    const handleStylePreferenceChange = (
        field: keyof StylePreferences,
        value: string
    ) => {
        setStylePreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Generate outfit function
    const generateOutfit = async () => {
        if (!user) return;

        setIsLoading(true);

        const clothesRef = collection(db, "clothes");
        const q = query(clothesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const wardrobeMap = new Map();
        querySnapshot.docs.forEach(doc => {
            wardrobeMap.set(doc.id, {
                id: doc.id,
                imageUrl: doc.data().imageUrl,
                dominantColor: doc.data().dominantColor,
                category: doc.data().category || "Unknown",
                subCategory: doc.data().category || "Unknown",
                vibe: doc.data().vibe || "Unknown",
                season: doc.data().season || "Unknown",
            });
        });

        const wardrobe = Array.from(wardrobeMap.values());

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wardrobe, stylePreferences }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch outfits');
            }

            const { outfits } = await response.json();

            const mappedOutfits = outfits.map((outfit: OutfitRecommendation) => ({
                ...outfit,
                outfit_pieces: {
                    Top: wardrobeMap.get(outfit.outfit_pieces.Top)?.imageUrl,
                    Bottom: wardrobeMap.get(outfit.outfit_pieces.Bottom)?.imageUrl,
                    Shoes: wardrobeMap.get(outfit.outfit_pieces.Shoes)?.imageUrl,
                },
            }));

            setOutfit(mappedOutfits);
            setCurrentScreen('outfitDisplay');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Render current screen
    const renderScreen = () => {
        switch (currentScreen) {
            case 'upload':
                return <Upload onNext={() => navigateTo('styleSelection')} />;
            case 'styleSelection':
                return (
                    <StyleSelection
                        stylePreferences={stylePreferences}
                        onStyleChange={handleStylePreferenceChange}
                        onBack={() => navigateTo('upload')}
                        onNext={generateOutfit}
                    />
                );
            case 'outfitDisplay':
                return (
                    <OutfitDisplay
                        outfit={outfit}
                        onBack={() => navigateTo('styleSelection')}
                    />
                );
            default:
                return <Upload onNext={() => navigateTo('styleSelection')} />;
        }
    };

    return (
        <SafeAreaView className="flex-1 h-full bg-primary dark:bg-secondary">
            {renderScreen()}
        </SafeAreaView>
    );
};

export default StylistPage;