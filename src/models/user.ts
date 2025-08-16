import mongoose, { Schema } from 'mongoose';
import type { UserDocument } from '@types'

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
