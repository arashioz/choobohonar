import { Module } from '@nestjs/common';
import { ContentGateway } from './content.gateway';

@Module({
  providers: [ContentGateway],
})
export class WebsocketsModule {}
