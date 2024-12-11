import { Document } from 'mongoose';

export interface MongoDocument extends Document {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}