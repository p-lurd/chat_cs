import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema({
    name:{ type: String, required: true},
    message: {type: String, required: true},
    userId: {type: String, required: true},
    roomId: {type: String, required: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, required: false}
}, {
    timestamps: true,
}
)

export interface Chat {
    name: string;
    message: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    roomId: string;
}

export const ChatModelName = 'Chat';

export type ChatDocument = Chat & mongoose.Document;