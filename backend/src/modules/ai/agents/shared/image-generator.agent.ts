import { Injectable, Inject } from '@nestjs/common';
import { IMAGE_PROVIDER } from '../../providers/image/image.interface';

@Injectable()
export class ImageGeneratorAgent {
  constructor(@Inject(IMAGE_PROVIDER) private imageProvider: any) {}

  async run(prompt: string): Promise<string> {
    return this.imageProvider.generate(prompt);
  }
}
