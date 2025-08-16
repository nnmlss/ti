import type { Document } from 'mongoose';
import type { User, FlyingSite } from './entities.js';

// ===== MONGOOSE DOCUMENT TYPES =====
export interface UserDocument extends Omit<User, '_id'>, Document {
  _id: string;
}

export interface FlyingSiteDocument extends Omit<FlyingSite, '_id'>, Document {
  _id: number;
}

// ===== INPUT DATA TYPES =====
export interface CreateSiteData extends Omit<FlyingSite, '_id'> {}