import * as mongoose from 'mongoose';
import { ROLES } from '../utililities/user.enum';

// export const UserSchema = new mongoose.Schema({
//     // "_id": ObjectId(),
//     "name": String,
//     "email": {type: String, unique: true},
//     "role": ROLES, // "customer" or "support" or "admin"
//     "createdAt": {type: Date, default: Date.now()},
//   }
// )
// export const User = { name: 'User' };
// export type UserDocument = User & Document;
  


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
    createdAt: { type: Date, default: Date.now },
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
}

// model name
export const UserModelName = 'User';

// document type with Mongoose's Document
export type UserDocument = User & mongoose.Document;
