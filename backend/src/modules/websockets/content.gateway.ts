import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true },
  namespace: '/content',
})
export class ContentGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ContentGateway.name);

  afterInit() {
    this.logger.log('WebSocket gateway initialized');
  }

  @SubscribeMessage('content:subscribe')
  handleSubscribe(@MessageBody() data: { jobId: string }, @ConnectedSocket() client: Socket) {
    client.join(`job:${data.jobId}`);
    this.logger.log(`Client subscribed to job ${data.jobId}`);
  }

  @OnEvent('content.progress')
  handleProgress(payload: { jobId: string; step: string; message: string; progress: number }) {
    this.server.to(`job:${payload.jobId}`).emit('content:progress', payload);
    this.server.emit('queue:update', payload);
  }

  @OnEvent('content.ready')
  handleReady(payload: { jobId: string }) {
    this.server.to(`job:${payload.jobId}`).emit('content:ready', payload);
    this.server.emit('content:ready', payload);
  }

  @OnEvent('content.error')
  handleError(payload: { jobId: string; error: string }) {
    this.server.to(`job:${payload.jobId}`).emit('content:error', payload);
  }
}
