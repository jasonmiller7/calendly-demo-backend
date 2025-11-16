import mongoose, { Schema, Document } from "mongoose";

export interface IWebhookEvent extends Document {
  event: string;
  payload: any;
  receivedAt: Date;
}

const WebhookEventSchema = new Schema<IWebhookEvent>({
  event: { type: String, required: true },
  payload: { type: Object, required: true },
  receivedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWebhookEvent>("WebhookEvent", WebhookEventSchema);
