import { Schema, Document } from 'mongoose';

export interface Product extends Document {
    _id?: string;
    name: string;
    description: string;
    model: string;
    quantity: number;
    price: number;
    provider_code: string;
}

export const ProductSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    model: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    provider_code: { type: String, required: true }
});