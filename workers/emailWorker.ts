import "dotenv/config";
import {Worker,Job} from "bullmq";
import {Redis} from "ioredis";
import { CampaignService } from "../services/campaignService.js";

const connection = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null
});

export const emailWorker = new Worker(
    "email-campaign-queue",
    async(job: Job) => {
        const {campaignId} = job.data;

        console.log(`[Worker] Picked up job ${job.id}. Processing campaign #${campaignId}...`);

       //process sending in campaign service


        console.log(`[Worker] Successfully finished campaign #${campaignId}!`);
    },
    {
        connection,
        concurrency: 5
    }
);

emailWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully.`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error: ${err.message}`);
});