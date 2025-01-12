import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/../firebaseConfig";
import { ClothingItem, OutfitItem } from "@/types/wardrobe";

export const useClothes = (userId: string | undefined) => {
    const [clothes, setClothes] = useState<ClothingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const clothesRef = collection(db, "clothes");
        const q = query(clothesRef, where("userId", "==", userId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const clothesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ClothingItem[];

            setClothes(clothesData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { clothes, isLoading, setClothes };
};

export const useOutfits = (userId: string | undefined) => {
    const [outfits, setOutfits] = useState<OutfitItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const outfitsRef = collection(db, "outfits");
        const q = query(outfitsRef, where("userId", "==", userId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const outfitsData = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    outfitPieces: data.outfit_pieces,
                    createdAt: data.createdAt,
                    match: data.match,
                    label: data.label,
                    stylePreferences: data.stylePreferences,
                    userId: data.userId,
                } as OutfitItem;
            });

            setOutfits(outfitsData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { outfits, isLoading, setOutfits };
};

export const useTrendingOutfits = (limitCount: number = 10) => {
    const [trendingOutfits, setTrendingOutfits] = useState<OutfitItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const outfitsRef = collection(db, "outfits");
        
        const q = query(
            outfitsRef,
            orderBy("match", "desc"),
            limit(limitCount)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const outfitsData = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    outfitPieces: data.outfit_pieces,
                    createdAt: data.createdAt,
                    match: data.match,
                    label: data.label,
                    stylePreferences: data.stylePreferences,
                } as OutfitItem;
            });

            setTrendingOutfits(outfitsData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [limitCount]);

    return { trendingOutfits, isLoading };
};