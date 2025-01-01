import RNColorThief from 'react-native-color-thief';

export const extractDominantColor = async (imageUri: string): Promise<string> => {
    const quality = 12;
    const includeWhite = false;

    function rgbToHex(r: number, g: number, b: number): string {
        return (
            '#' +
            [r, g, b]
                .map((component) => {
                    const hex = component.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                })
                .join('')
        );
    }

    if (!imageUri) {
        return '#FFFFFF';
    }

    try {
        const color = await RNColorThief.getColor(imageUri, quality, includeWhite);
        const hexColor = rgbToHex(color.r, color.g, color.b);
        console.log('Extracted Hex Color:', hexColor);
        return hexColor;
    } catch (error) {
        console.error('Error extracting color:', error);
        return '#FFFFFF';
    }
};
