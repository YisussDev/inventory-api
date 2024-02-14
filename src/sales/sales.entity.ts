import { Schema, Document } from 'mongoose';

export interface Sale extends Document {
    _id?: string;
    products: string;
    total_value: string;
    date_sale: string;
    document_client: string;
}

export const SaleSchema = new Schema({
    _id: { type: String, required: true },
    products: { type: String, required: true },
    total_value: { type: String, required: true },
    date_sale: { type: String, required: true },
    document_client: { type: String, required: true },
});