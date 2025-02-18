import { db, storage } from "@/../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

import { fetchPredictionData } from "./dragoneyeUtils.ts";
import { BACKEND_URL } from "@env";

export const handleUpload = async (
    images: File[],
    user: { uid: string } | null,
    dominantColors: string[],
    onUploadSuccess: () => void,
    onError: (error: Error) => void
) => {
    if (!images.length || !user) {
        return;
    }

    const apiUrl =`${BACKEND_URL}/api/predict`;
    console.log("API URL:", apiUrl);

    try {
        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const storageRef = ref(storage, `clothes/${user.uid}/${file.name}`);

            console.log("Starting storage upload...");
            await uploadBytes(storageRef, file);

            console.log("Getting download URL...");
            const imageUrl = await getDownloadURL(storageRef);
            console.log("Download URL:", imageUrl);

            const modelName = 'dragoneye/fashion';
            const altModelName = 'dragoneye/footwear';

            console.log("Calling prediction API...");
            const predictionData = await fetchPredictionData(apiUrl, imageUrl, modelName, altModelName);
            console.log("predictionData", predictionData);
            const { category, vibe, season, color, subCategory  } = predictionData[0];

            console.log("Creating Firestore document...");
            await addDoc(collection(db, "clothes"), {
                userId: user.uid,
                imageUrl,
                dominantColor: dominantColors[i],
                category,
                subCategory,
                vibe,
                season,
                color,
                uploadedAt: new Date(),
            });
        }

        onUploadSuccess();
    } catch (error) {
        console.error("Error uploading image:", error, user?.uid, images.length);

        onError(error as Error);
    }
};
