import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ContentModule } from './modules/content/content.module';
import { AiModule } from './modules/ai/ai.module';
import { ContentQueueModule } from './modules/content-queue/content-queue.module';
import { WebsocketsModule } from './modules/websockets/websockets.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/choob-va-honar'),
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    EventEmitterModule.forRoot(),
    AiModule,
    ContentModule,
    ContentQueueModule,
    WebsocketsModule,
    // Admin module for uploads and simple auth
    AdminModule,
  ],
})
export class AppModule {}
