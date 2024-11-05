import { HttpException, Injectable, Inject } from '@nestjs/common';
import { CreateSupportDto, LoginDto } from './dto/create-support.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModelName } from 'src/users/schemas/user.schema';
import { uuid } from 'uuidv4';
import {
  failedUpdateException,
  notFoundError,
  ticketNotCreatedException,
  unexpectedErrorException,
  userAlreadyExists,
  userNotCreated,
} from 'src/utilities/exceptions/httpExceptions';
import { ROLES } from 'src/users/utililities/user.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketDocument, TicketModelName } from './schema/ticket.schema';
import { TicketState } from './utilities/ticket.enum';
import * as bcrypt from 'bcryptjs';
import {CACHE_MANAGER} from '@nestjs/cache-manager'
import { Cache } from 'cache-manager';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(UserModelName) private userModel: Model<UserDocument>,
    @InjectModel(TicketModelName) private ticketModel: Model<TicketDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createSupport(createSupportDto: CreateSupportDto) {
    try {
      const { email, name, password } = createSupportDto;
      const user = await this.userModel.findOne({ email: email });
      if (user) {
        throw new userAlreadyExists('101CS');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        role: ROLES.support,
      });
      return newUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new unexpectedErrorException('102CS');
    }
  }

  async createTicket(createTicketDto: CreateTicketDto) {
    try {
      const { roomId, userId} = createTicketDto;
      const newTicket = await this.ticketModel.create({
        roomId,
        userId,
        state: TicketState.inactive,
      });
      if (!newTicket) {
        throw new ticketNotCreatedException('103SS');
      }
      return newTicket;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new unexpectedErrorException('104CS');
    }
  }

  async findAllTickets() {
    try {
      // checks redis before hitting the database  
      if(await this.cacheManager.get('tickets')){
        return await this.cacheManager.get('tickets')
      }
      const tickets = await this.ticketModel
        .find({
          state: { $in: ['active', 'inactive'] }, // active before inactive
        })
        .sort({ createdAt: 1 }) // sorted in descending order
        .limit(20);
      if (!tickets) {
        throw new notFoundError('105CS', 'no ticket found');
      }
      await this.cacheManager.set('tickets', tickets);  // sets the value into redis
      return tickets;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new unexpectedErrorException('106CS');
    }
  }

  async findOneTicket(id: string) {
    try {
      const ticket = await this.ticketModel.findOne({_id: id});
      if(!ticket) {
        throw new notFoundError('107CS', 'no ticket found');
      }
      return ticket;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new unexpectedErrorException('107CS')
    }
  }

  
  async updateTicket(id: string, updateTicketDto: UpdateTicketDto) {
    try {
    const ticket = await this.ticketModel.findById(id);

    if (!ticket) {
        throw new notFoundError('108CS', 'ticket not found')
    }

    if (updateTicketDto.state) {
        ticket.state = updateTicketDto.state;
    }

    if (updateTicketDto.supportId) {
        if (!ticket.supportIds.includes(updateTicketDto.supportId)) {
            ticket.supportIds.push(updateTicketDto.supportId);
        }
    }
    const updatedTicket = await ticket.save();
    return updatedTicket;
  } catch(error){
    if (error instanceof HttpException) {
      throw error;
    }
    throw new unexpectedErrorException('108CS');
  }
}

  remove(id: number) {
    return `This action removes a #${id} support`;
  }
}
