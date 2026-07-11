import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrchestratorAgent } from '../ai/agents/orchestrator.agent';

export const CONTENT_QUEUE = 'content-generation';

@Processor(CONTENT_QUEUE)
export class ContentGenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(ContentGenerationProcessor.name);

  constructor(private orchestrator: OrchestratorAgent) {
    super();
  }

  async process(job: Job<{ jobId: string }>): Promise<void> {
    this.logger.log(`Processing job ${job.data.jobId}`);
    await this.orchestrator.run(job.data.jobId);
  }
}
