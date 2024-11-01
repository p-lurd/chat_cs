import { HttpException, Injectable } from '@nestjs/common';
import { CreateSupportDto, LoginDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModelName } from 'src/users/schemas/user.schema';
import { uuid } from 'uuidv4';
import {
  failedUpdateException,
  notFoundException,
  ticketNotCreatedException,
  unexpectedErrorException,
  userAlreadyExists,
  userNotCreated,
} from 'src/utilities/exceptions/exceptions';
import { ROLES } from 'src/users/utililities/user.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketDocument, TicketModelName } from './schema/ticket.schema';
import { TicketState } from './utilities/ticket.enum';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(UserModelName) private userModel: Model<UserDocument>,
    @InjectModel(TicketModelName) private ticketModel: Model<TicketDocument>,
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
      const tickets = await this.ticketModel
        .find({
          state: { $in: ['active', 'inactive'] }, // active before inactive
        })
        .sort({ createdAt: 1 }) // sorted in descending order
        .limit(20);
      if (!tickets) {
        throw new notFoundException('105CS', 'no ticket found');
      }
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
        throw new notFoundException('107CS', 'no ticket found');
      }
      return ticket;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new unexpectedErrorException('107CS')
    }
  }

  async update(id: string, updateSupportDto: UpdateSupportDto) {
    try {
      const updatedTicket = await this.ticketModel.findByIdAndUpdate({_id: id}, {state: updateSupportDto.state}, {new: true});
      if(!updatedTicket) {
        throw new failedUpdateException('108CS', 'ticket status not changed')
      }
      return updatedTicket;
    } catch (error) {
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
