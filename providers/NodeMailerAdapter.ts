import nodemailer from "nodemailer";
import type { EmailProvider,SendEmailOptions } from "../interfaces/emailProvider.js";

export class NodeMailer implements EmailProvider{
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST ,//create in env file
        port: Number(process.env.SMTP_PORT),
        auth:{
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    async send(options: SendEmailOptions){
        return await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.body
        });
    }
}