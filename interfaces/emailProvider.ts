export interface SendEmailOptions {
    to: string;
    subject: string;
    body: string;
}

export interface EmailProvider {
   send(options: SendEmailOptions): Promise<void>;
}