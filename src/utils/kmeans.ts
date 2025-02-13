export class KMeans {
    private k: number;
    private maxIterations: number;
    private centroids: number[][] = [];
    private data: number[][] = [];

    constructor(k: number, maxIterations: number = 100) {
        this.k = k;
        this.maxIterations = maxIterations;
    }

    fit(data: number[][]): number[][] {
        this.data = data;
        this.initializeCentroids();
        let iterations = 0;
        let changed: boolean;

        do {
            const clusters = this.assignClusters();
            changed = this.updateCentroids(clusters);
            iterations++;
        } while (changed && iterations < this.maxIterations);

        return this.centroids;
    }

    private initializeCentroids() {
        this.centroids = [];
        const firstIdx = Math.floor(Math.random() * this.data.length);
        this.centroids.push([...this.data[firstIdx]]);

        for (let i = 1; i < this.k; i++) {
            const distances = this.data.map(p =>
                Math.min(...this.centroids.map(c => this.distanceSquared(p, c)))
            );
            const sum = distances.reduce((a, b) => a + b, 0);
            const threshold = Math.random() * sum;
            let cumulative = 0;
            let nextIdx = distances.findIndex(d => (cumulative += d) >= threshold);
            this.centroids.push([...this.data[nextIdx]]);
        }
    }

    private assignClusters(): number[] {
        return this.data.map(point => {
            let minDist = Infinity;
            let cluster = -1;
            this.centroids.forEach((centroid, i) => {
                const dist = this.distanceSquared(point, centroid);
                if (dist < minDist) {
                    minDist = dist;
                    cluster = i;
                }
            });
            return cluster;
        });
    }

    private updateCentroids(clusters: number[]): boolean {
        let changed = false;
        this.centroids = this.centroids.map((_, i) => {
            const points = this.data.filter((_, j) => clusters[j] === i);
            if (points.length === 0) return this.centroids[i];
            const newCentroid = points[0].map((_, dim) =>
                Math.round(points.reduce((sum, p) => sum + p[dim], 0) / points.length)
            );
            changed = changed || !this.arraysEqual(newCentroid, this.centroids[i]);
            return newCentroid;
        });
        return changed;
    }

    private distanceSquared(a: number[], b: number[]): number {
        return a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0);
    }

    private arraysEqual(a: number[], b: number[]): boolean {
        return a.every((val, i) => val === b[i]);
    }
}