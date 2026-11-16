import "dotenv/config";
import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { CampaignRepo } from "../repos/campaignRepo.js";
import { NodeMailer } from "../providers/NodeMailerAdapter.js";

console.log("[Worker] FILE LOADED");

const connection = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null
});

connection.on("connect", () => console.log("[Redis] connected"));
connection.on("error", (err) => console.error("[Redis] error:", err.message));

const campaignRepo = new CampaignRepo();
const provider = new NodeMailer();

export const emailWorker = new Worker("email-campaign-queue", async (job) => {
    console.log("[Worker] JOB RECEIVED:", job.id, job.data);

    const { campaignId } = job.data;

    const campaign = await campaignRepo.findById(campaignId);
    if (!campaign) throw new Error("Campaign not found");

    await campaignRepo.updateStatus(campaignId, "sending");

    for (const recipient of campaign.recipients) {
        await provider.send({
            to: recipient,
            subject: campaign.title,
            body: campaign.email,
        });
    }

    await campaignRepo.updateStatus(campaignId, "sent");
}, { connection, concurrency: 5 });

console.log("[Worker] WORKER CREATED");

emailWorker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully.`);
});

emailWorker.on("failed", async (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed with error: ${err.message}`);
    if (!job) return;

    const maxAttempts = job.opts.attempts ?? 1;
    const willRetry = job.attemptsMade < maxAttempts;
    if (willRetry) {
        console.log(`[Worker] Attempt ${job.attemptsMade}/${maxAttempts}, retry...`);
        return;
    }

    await campaignRepo.updateStatus(job.data.campaignId, "failed");
});

emailWorker.on("error", (err) => {
    console.error("[Worker] error:", err.message);
});