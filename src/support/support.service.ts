import { HttpException, Injectable } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModelName } from 'src/users/schemas/user.schema';
import { uuid } from 'uuidv4';
import { ticketNotCreatedException, unexpectedErrorException, userAlreadyExists, userNotCreated } from 'src/utilities/exceptions/exceptions';
import { ROLES } from 'src/users/utililities/user.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketDocument, TicketModelName } from './schema/ticket.schema';
import { TicketState } from './utilities/ticket.enum';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(UserModelName) private userModel: Model<UserDocument>,
    @InjectModel(TicketModelName) private ticketModel: Model<TicketDocument>,
  ){}

  async createSupport(createSupportDto: CreateSupportDto) {
    try {
      const email = createSupportDto.email
      const name = createSupportDto.name
      const user = await this.userModel.findOne({ email: email})
      if(user) {
        throw new userAlreadyExists('101CS')
      }
      // if not a user, create a new user
      const roomId = await uuid()
      const newUser = await this.userModel.create({name, email, roomId, role: ROLES.support})
      return newUser;
    } catch (error) {
      if(error instanceof HttpException){
      throw error
      }
      throw new unexpectedErrorException('102CS')
    }
    
  }

  async createTicket(createTicketDto: CreateTicketDto){
    try {
      const {roomId, userId, supportId} = createTicketDto
    const newTicket = await this.ticketModel.create(
      {
        roomId,
        userId,
        supportIds: [supportId],
        state: TicketState.pending
      }
    )
    if(!newTicket){
      throw new ticketNotCreatedException('103SS')
    }
    return newTicket;
    } catch (error) {
      if (error instanceof HttpException){
        throw error
      }
      throw new unexpectedErrorException('104CS')
    }
    
  }

  findAll() {
    return `This action returns all support`;
  }

  findOne(id: number) {
    return `This action returns a #${id} support`;
  }

  update(id: number, updateSupportDto: UpdateSupportDto) {
    return `This action updates a #${id} support`;
  }

  remove(id: number) {
    return `This action removes a #${id} support`;
  }



}
