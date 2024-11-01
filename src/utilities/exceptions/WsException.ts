import { WsException } from "@nestjs/websockets";

export class userNotCreatedWsException extends WsException{
    constructor(intCode: string){
        super({message: "absent userId in header", intCode});
    }
}

export class userNotFoundWsException extends WsException{
    constructor(intCode: string){
        super({message: 'user not found', intCode})
    }
}

export class notFoundWsError extends WsException{
    constructor(intCode: string, message: string){
        super({message, intCode})
    }
}