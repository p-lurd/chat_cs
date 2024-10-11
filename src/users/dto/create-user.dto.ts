export class CreateUserDto {
    name: string;
    email: string;
}

export class UserDto {
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    roomId: String;
}