import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
  userId: string;
  accessToken: string;
}

const TokenSchema = new Schema<IToken>({
  userId: { type: String, required: true },
  accessToken: { type: String, required: true },
});

export default mongoose.model<IToken>("Token", TokenSchema);
