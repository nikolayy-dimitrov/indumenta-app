import { Alert } from "react-native";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/../firebaseConfig";
import { UseItemManagementProps, UseItemManagementReturn } from "@/types/wardrobe";

export const useItemOptions = ({
                                      setClothes,
                                      setOutfits,
                                      onClose
                                  }: UseItemManagementProps): UseItemManagementReturn => {
    const deleteItem = async (itemId: string, itemType: 'clothes' | 'outfits') => {
        try {
            const itemDocRef = doc(db, itemType, itemId);
            await deleteDoc(itemDocRef);

            if (itemType === 'clothes' && setClothes) {
                setClothes(prevClothes => prevClothes.filter(item => item.id !== itemId));
            } else if (itemType === 'outfits' && setOutfits) {
                setOutfits(prevOutfits => prevOutfits.filter(item => item.id !== itemId));
            }
        } catch (error) {
            console.error(`Error deleting ${itemType} item:`, error);
            Alert.alert(
                "Error",
                `Failed to delete ${itemType} item. Please try again.`
            );
        }
    };

    const confirmDelete = (itemId: string, itemType: 'clothes' | 'outfits') => {
        Alert.alert(
            "Delete Item",
            `Are you sure you want to remove this ${itemType.slice(0, -1)}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteItem(itemId, itemType);
                        onClose();
                    },
                }
            ]
        );
    };

    return {
        deleteItem,
        confirmDelete,
    };
};