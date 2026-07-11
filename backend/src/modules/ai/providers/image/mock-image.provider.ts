import { Injectable } from '@nestjs/common';
import { ImageProvider } from './image.interface';

const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/seed/wood1/1200/630',
  'https://picsum.photos/seed/wood2/1200/630',
  'https://picsum.photos/seed/wood3/1200/630',
  'https://picsum.photos/seed/wood4/1200/630',
  'https://picsum.photos/seed/wood5/1200/630',
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class MockImageProvider implements ImageProvider {
  async generate(_prompt: string): Promise<string> {
    await delay(1200 + Math.floor(Math.random() * 800));
    const index = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
    return PLACEHOLDER_IMAGES[index];
  }
}
