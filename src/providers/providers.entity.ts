import { Schema, Document } from 'mongoose';

export interface Provider extends Document {
    _id?: string;
    name: string;
    code: string;
}

export const ProviderSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true }
});