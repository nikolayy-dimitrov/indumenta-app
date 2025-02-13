import { KMeans } from './kmeans';
import { getImagePixels } from './imageManipulationUtils';

export async function getDominantColors(uri: string, k: number = 3): Promise<string[]> {
    const pixels = await getImagePixels(uri);
    const kmeans = new KMeans(k);
    const centroids = kmeans.fit(pixels);

    return centroids.map(c => {
        const [r, g, b] = c.map(v => Math.round(v));
        return `#${[r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')}`;
    });
}