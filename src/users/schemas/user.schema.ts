import * as mongoose from 'mongoose';
import { ROLES } from '../utililities/user.enum';
 
// Define the schema
export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: { 
        type: String, 
        enum: [ROLES.customer, ROLES.support, ROLES.admin],
        default: ROLES.customer
    },
    roomId: { type: String, required: false },
    password: { type: String, required: false}
}, {
    timestamps: true,
});

// TypeScript interface for the document
export interface User {
    name: string;
    email: string;
    role: ROLES;
    createdAt: Date;
    roomId: string;
    password?: string;
}

// model name
export const UserModelName = 'User';

// document type with Mongoose's Document
export type UserDocument = User & mongoose.Document;
