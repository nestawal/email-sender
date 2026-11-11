import "dotenv/config";
import {Worker,Job} from "bullmq";
import {Redis} from "ioredis";
import { CampaignService } from "../services/campaignService.js";
import { CampaignRepo } from "../repos/campaignRepo.js";
import { NodeMailer } from "../providers/NodeMailerAdapter.js";

const connection = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null
});

const campaignRepo = new CampaignRepo();
const provider = new NodeMailer();

export const emailWorker = new Worker("email-campaign", async (job) => {
    const { campaignId } = job.data;
    

    const campaign = await campaignRepo.findById(campaignId);
    if (!campaign) throw new Error("Campaign not found");

    // 1. mark as actively sending
    await campaignRepo.updateStatus(campaignId, "sending");

    // 2. send to every recipient
    for (const recipient of campaign.recipients) {
        await provider.send({
            to: recipient,
            subject: campaign.title,
            body: campaign.email,
        });
    }

    // 3. mark as done
    await campaignRepo.updateStatus(campaignId, "sent");
}, { connection,concurrency: 5 });

emailWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully.`);
});

emailWorker.on('failed', async(job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error: ${err.message}`);

  if(!job)return;

  const maxAttempts = job.opts.attempts ?? 1;
  const willRetry = job.attemptsMade < maxAttempts;
  if(willRetry){
    console.log(`[Worker] Attempt ${job.attemptsMade}/${maxAttempts}, retry...`)
    return;
  }

  const repo = new CampaignRepo();
  await repo.updateStatus(job.data.campaignId,"failed");
});