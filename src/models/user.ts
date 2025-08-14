import mongoose, { Schema, Document } from 'mongoose';

export interface User {
  _id: string;
  email: string;
  password?: string;
  username?: string;
  invitationToken?: string;
  tokenExpiry?: Date;
  isActive: boolean;
  isSuperAdmin?: boolean;
}

export interface UserDocument extends Omit<User, '_id'>, Document {
  _id: string;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    username: { type: String },
    invitationToken: { type: String },
    tokenExpiry: { type: Date },
    isActive: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean },
  },
  {
    id: false, // Disable virtual id field
  }
);

export const User = mongoose.model<UserDocument>('User', userSchema, 'users');
