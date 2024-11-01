import * as mongoose from 'mongoose';
import { TicketState } from '../utilities/ticket.enum';


export const TicketSchema = new mongoose.Schema({
    roomId: { type: 'string', required: true },
    userId: { type: 'string', required: true},
    supportIds: { type: 'array', default: [], required: true},
    state: { type: 'string', default: TicketState.inactive, required: true },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
}
);


export interface Ticket {
    roomId: string;
    userId: string;
    supportIds?: [string]
    state: string;
}

export const TicketModelName = 'Ticket';

export type TicketDocument = Ticket & mongoose.Document;