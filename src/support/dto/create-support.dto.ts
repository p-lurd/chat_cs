
export class CreateSupportDto {
    name: string;
    email: string;
    password: string;
}

export class SupportDto {
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    roomId: String;
}

export class LoginDto {
    email: string;
    password: string;
}