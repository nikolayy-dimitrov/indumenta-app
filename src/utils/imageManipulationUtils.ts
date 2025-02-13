import * as ImageManipulator from 'expo-image-manipulator';
import UPNG from 'upng-js';
import { Buffer } from 'buffer';

export async function getImagePixels(uri: string): Promise<number[][]> {
    // Resize and convert the image to PNG format
    const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 100, height: 100 } }],
        { format: ImageManipulator.SaveFormat.PNG, base64: true }
    );

    // Get the base64 string from the manipulated image
    const base64 = manipulated.base64 ?? '';

    // Convert the base64 string to a Uint8Array
    const bytes = Uint8Array.from(Buffer.from(base64, 'base64'));

    // Decode the PNG image using UPNG
    const png = UPNG.decode(bytes.buffer); // Use .buffer to get the ArrayBuffer

    // Convert the ArrayBuffer to a Uint8Array for easier iteration
    const pixelData = new Uint8Array(png.data);

    // Extract RGB values from the pixel data
    const pixels: number[][] = [];

    for (let i = 0; i < pixelData.length; i += 4) {
        const r = pixelData[i];
        const g = pixelData[i + 1];
        const b = pixelData[i + 2];
        const a = pixelData[i + 3];

        // Skip transparent pixels
        if (a === 0) continue;

        // Add the RGB values to the pixels array
        pixels.push([r, g, b]);
    }

    return pixels;
}