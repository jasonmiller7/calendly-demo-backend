import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  uri: string;
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true },
  uri: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
