
export class CreateSupportDto {
    name: string;
    email: string;
}

export class SupportDto {
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    roomId: String;
}