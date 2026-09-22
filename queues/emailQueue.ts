import 'dotenv/config';
import { Queue } from "bullmq";
import {Redis} from "ioredis";

const connection = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("email-campaign-queue",{connection});