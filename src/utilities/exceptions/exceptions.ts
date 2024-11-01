import { HttpException,HttpStatus } from "@nestjs/common";

export class userNotCreated extends HttpException {
    constructor(intCode: string){
        super({message: 'user not created', intCode}, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export class unexpectedErrorException extends HttpException{
    constructor(intCode: string){
        super({message: 'unexpected error', intCode}, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export class userAlreadyExists extends HttpException{
    constructor(intCode: string){
        super({message: 'user already exists', intCode}, HttpStatus.CONFLICT)
    }
}

export class userNotFoundException extends HttpException{
    constructor(intCode: string){
        super({message: 'user not found', intCode}, HttpStatus.NOT_FOUND)
    }
}

export class ticketNotCreatedException extends HttpException{
    constructor(intCode: string){
        super({message: 'ticket not created', intCode}, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export class notFoundException extends HttpException{
    constructor(intCode: string, message: string){
        super({message, intCode}, HttpStatus.NOT_FOUND)
    }
}

export class failedUpdateException extends HttpException{
    constructor(intCode: string, message: string){
        super({message, intCode}, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export class unauthorisedUserException extends HttpException{
    constructor(intCode: string, message: string){
        super({message, intCode}, HttpStatus.UNAUTHORIZED)
    }
}