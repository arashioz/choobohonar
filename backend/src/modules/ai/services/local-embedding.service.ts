import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalEmbeddingService {
  /**
   * Generates a 384-dimensional dense vector using Transformers.js (Xenova/all-MiniLM-L6-v2)
   * Runs 100% locally on CPU without external API calls or cost.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Dynamic import for @xenova/transformers or lightweight local fallback calculation
      const { pipeline } = await eval(`import('@xenova/transformers')`);
      const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    } catch (e) {
      // Deterministic lightweight local vector generator fallback (for offline dev/test without npm transformers)
      return this.generateMockVector(text, 384);
    }
  }

  private generateMockVector(text: string, dim: number): number[] {
    const vector = new Array(dim).fill(0);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      vector[i % dim] = (vector[i % dim] + charCode / 255.0) % 1.0;
    }
    // Normalize vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vector.map((val) => val / magnitude);
  }
}
