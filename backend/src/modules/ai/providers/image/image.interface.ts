export interface ImageProvider {
  generate(prompt: string): Promise<string>;
}

export const IMAGE_PROVIDER = 'IMAGE_PROVIDER';
