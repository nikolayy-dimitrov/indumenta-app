import { Timestamp } from "firebase/firestore";

export type ViewMode = 'clothes' | 'outfits';
export type SortOption = 'newest' | 'oldest' | 'color';

export interface ClothingItem {
    id: string;
    imageUrl: string;
    dominantColor: string;
    uploadedAt: Timestamp;
    userId: string;
    category: string;
    subCategory: string;
}

export interface OutfitItem {
    id: string;
    label: string;
    outfitPieces: { Top: string; Bottom: string; Shoes: string };
    createdAt: Timestamp;
    match: number;
    stylePreferences: { color: string; occasion: string };
}