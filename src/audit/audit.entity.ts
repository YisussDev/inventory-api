import { Schema, Document } from 'mongoose';

export interface Audit extends Document {
  _id?: string;
  action_type: string;
  module_name: string;
  user_id: string;
  date_action: string;
  data: string;
}

export const AuditSchema = new Schema({
  _id: { type: String, required: true },
  action_type: { type: String, required: true },
  module_name: { type: String, required: true },
  user_id: { type: String, required: true },
  date_action: { type: String, required: true },
  data: { type: String, required: true },
});