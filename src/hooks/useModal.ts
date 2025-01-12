import { useState } from 'react';
import { ClothingItem, OutfitItem, UseModalReturn } from '@/types/wardrobe';

export const useModal = (): UseModalReturn => {
    const [selectedClothingItem, setSelectedClothingItem] = useState<ClothingItem | null>(null);
    const [selectedOutfitItem, setSelectedOutfitItem] = useState<OutfitItem | null>(null);
    const [isClothingModalVisible, setIsClothingModalVisible] = useState(false);
    const [isOutfitModalVisible, setIsOutfitModalVisible] = useState(false);

    const openClothingModal = (item: ClothingItem) => {
        setSelectedClothingItem(item);
        setIsClothingModalVisible(true);
    };

    const openOutfitModal = (item: OutfitItem) => {
        setSelectedOutfitItem(item);
        setIsOutfitModalVisible(true);
    };

    const closeModals = () => {
        setIsClothingModalVisible(false);
        setIsOutfitModalVisible(false);
        setSelectedClothingItem(null);
        setSelectedOutfitItem(null);
    };

    return {
        selectedClothingItem,
        selectedOutfitItem,
        isClothingModalVisible,
        isOutfitModalVisible,
        openClothingModal,
        openOutfitModal,
        closeModals,
    };
};