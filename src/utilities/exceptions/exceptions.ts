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