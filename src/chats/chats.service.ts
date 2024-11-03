import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Chat,
  ChatDocument,
  ChatModelName,
  ChatSchema,
} from './schemas/chat.schema';
import {
  User,
  UserModelName,
  UserSchema,
  UserDocument,
} from 'src/users/schemas/user.schema';
import { UserDto } from 'src/users/dto/create-user.dto';
import { uuid } from 'uuidv4';
import { userNotFoundException } from 'src/utilities/exceptions/httpExceptions';
import { UsersService } from 'src/users/users.service';
import {
  notFoundWsError,
  userNotCreatedWsException,
  userNotFoundWsException,
} from 'src/utilities/exceptions/WsException';
import { WsException } from '@nestjs/websockets';
import { WinstonLogger } from 'src/utilities/logger/winston-logger.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatModelName) private readonly chatModel: Model<ChatDocument>, // Inject Chat model
    @InjectModel(UserModelName) private readonly userModel: Model<UserDocument>, // Inject User model
    private readonly usersService: UsersService, // Inject User service
    private readonly logger: WinstonLogger,
  ) {}

  private readonly MAX_ATTEMPTS = 5; // Maximum number of attempts
  private failedConnectionAttempts = new Map<string, number>(); // Track attempts per client
  async handleConnection(client, server) {
    try {
      const userId = client?.handshake?.query?.userId;
      console.log('userId: ' + userId);
      if (!userId) {
        this.logger.error('userId absent in query', '100HC');
        // Increment the attempt count
        const attempts = this.failedConnectionAttempts.get(client.id) || 0;
        this.failedConnectionAttempts.set(client.id, attempts + 1);

        if (attempts + 1 >= this.MAX_ATTEMPTS) {
          this.logger.warn(
            `Client ${client.id} exceeded connection attempts. Disconnecting.`,
          );
          client.disconnect(); // Disconnect after reaching max attempts
          return; // Stop further processing
        }

        // send an error message to the client
        client.emit(
          'error',
          'Missing userId. Please provide a userId in your connection request.',
        );

        client.disconnect();
        throw new userNotCreatedWsException('101HC');
      }

      // Reset attempt count if userId is provided
      this.failedConnectionAttempts.delete(client.id);

      const user = await this.usersService.getUserById(userId);
      if (user && user.role === 'customer') {
        if (client && client.to) {
          const roomId = await this.createRoom({ client, userId });
          console.log('roomId: ' + roomId);
          const { password, ...filteredUser } = user;
          client.to(roomId).emit('notification', {
            message: 'we are here',
            user: filteredUser,
          });
        }

        return;
      } else {
        throw new userNotCreatedWsException('102HC');
      }
    } catch (error) {
      console.log({ error });
      client.emit(
        'error',
        error instanceof WsException
          ? error.getError()
          : 'Internal server error',
      );
      client.disconnect();
    }

    // auto leave the room after 5mins timeout
    // when ticket is closed, all user leave room auto
  }
  async create(createChatDto: CreateChatDto, server) {
    console.log('newMesssage: ', createChatDto);
    const { message, userId } = createChatDto;
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      this.logger.warn('user not found--CC100');
      throw new userNotFoundWsException('CC100');
    }
    const chat = await this.chatModel.create({
      name: user.name,
      message,
      userId,
    });
    // emit to users in the room
    const data = {
      message,
      userId,
      name: user.name,
    };
    server.to(user.roomId).emit('newMessage', data);

    return chat;
  }

  async findAll(userId) {
    const messages = await this.chatModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(20);
    return messages;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  // Join the room
  async createRoom({ client, userId }) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      this.logger.warn('user not found--101CC');
      throw new notFoundWsError('User not found', '101CC');
    }
    const roomId = user.roomId;
    if (!roomId) {
      // generate a new roomId
      const roomId = await uuid();

      // --------------abstract it to userService
      await this.usersService.updateRoom({ roomId: roomId, _id: userId });
    }

    client.join(roomId);
    // emmit the he has joined
    client.to(roomId).emit('joined', true);
    return roomId;
  }

  async joinRoom({ client, roomId }) {
    try {
      client.join(roomId);
      client.to(roomId).emit('joined', true);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  async leaveRoom({ client, userId }) {
    const user: UserDto = await this.userModel.findOne({ _id: userId });
    if (user && user.roomId) {
      client.leave(user.roomId);
      this.logger.log('user left room');
      console.log('user left room');
      return;
    }
    console.log('user or roomId absent');
    return;
  }

  async closeRoom({ client, roomId }, server) {
    // Gets all connected socket to the room
    const room = client.sockets.adapter.rooms.get(roomId);

    if (room) {
      // Loops through each client in the room and make them leave
      room.forEach((clientId) => {
        const socket = client.sockets.sockets.get(clientId);
        if (socket) {
          socket.leave(roomId);
        }
      });
    }
    // note and emit the individual who closed the room
    server.to(roomId).emit('notification', 'chat closed by admin');
  }
}
