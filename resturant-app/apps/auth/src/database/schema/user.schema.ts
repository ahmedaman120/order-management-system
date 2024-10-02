import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  bio: String,
  firstName: String,
  lastName: String,
  lastSeen: Date,
  createdDate: {
    type: Date,
    default: new Date(),
  },
  updatedDate: {
    type: Date,
    default: new Date(),
  },
});
