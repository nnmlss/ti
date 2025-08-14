import mongoose, { Schema, Document } from 'mongoose';

export interface User {
  _id: number;
  email: string;
  password?: string;
  username?: string;
  invitationToken?: string;
  tokenExpiry?: Date;
  isActive: boolean;
}

export interface UserDocument extends Omit<User, '_id'>, Document {
  _id: number;
}

const userSchema = new Schema(
  {
    _id: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    username: { type: String },
    invitationToken: { type: String },
    tokenExpiry: { type: Date },
    isActive: { type: Boolean, default: false },
  },
  {
    _id: false,
    id: false, // Disable automatic ObjectId generation
  }
);

export const User = mongoose.model<UserDocument>('User', userSchema, 'users');
