import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  bio: string;
  firstName: string;
  lastName: string;
  password: string;
  lastSeen: Date;
  createdDate: Date;
  updatedDate: Date;
}
