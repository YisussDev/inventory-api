import { Schema, Document } from 'mongoose';

export interface User extends Document {
  _id?: string;
  email: string;
  name: string;
  password: number;
  img_url: string;
  rol: string;
}

export const UserSchema = new Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  img_url: { type: String, required: true },
  rol: { type: String, required: true }
});