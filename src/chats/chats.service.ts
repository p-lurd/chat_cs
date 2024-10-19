import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument, ChatModelName, ChatSchema } from './schemas/chat.schema';
import { User, UserModelName, UserSchema, UserDocument  } from 'src/users/schemas/user.schema';
import { UserDto } from 'src/users/dto/create-user.dto';
import { uuid } from 'uuidv4';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatModelName) private readonly chatModel: Model<ChatDocument>,  // Inject Chat model
    @InjectModel(UserModelName) private readonly userModel: Model<UserDocument>   // Inject User model
  ) {}
  async create(createChatDto: CreateChatDto, server) {
    console.log("newMesssage: ", createChatDto)
    const { message, userId} = createChatDto;
    const user = await this.userModel.findOne({ _id: userId})
    if(!user) {
      throw new HttpException({message: "User not found", intCode: "CC100"}, HttpStatus.NOT_FOUND)
    }
    const chat = await this.chatModel.create({
      name: user.name,
      message,
      userId,
    })
    // emit to users in the room
    const data = {
      message,
      userId,
      name: user.name
    }
    server.to(user.roomId).emit('newMessage', data)
    
    return chat;
  }

  async findAll(userId) {
    const messages = await this.chatModel
      .find({userId: userId})
      .sort({createdAt: -1})
      .limit(20)
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


  async getUserById(userId){
    const user: UserDto = await this.userModel.findOne({ id: userId})
    return user
  }

  // Join the room
  async joinRoom({client, userId}){
    const user = await this.userModel.findOne({ _id: userId})
    if(!user){
      throw new HttpException({
        message: "User not found",
        intCode: "CC101"
      },
      HttpStatus.NOT_FOUND 
      )
    }
    const roomId = user.roomId;
    if (!roomId) {
       // generate a new roomId
      const roomId = await uuid()
      await this.userModel.updateOne({ _id: userId}, { roomId: roomId },function (err, docs) {
        if (err){
            console.log(err)
            throw new HttpException(
              {
                message: "user update failed",
                intCode: "CC102",
              },
              HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        else{
            console.log("Updated Docs : ", docs);
        }
        })
    }

    client.join(roomId);

  }

  async leaveRoom({client, userId}){
    const user: UserDto = await this.userModel.findOne({ _id: userId})
    const roomId = user.roomId;
    if (!roomId) {

      // generate a new roomId

      console.log('roomId absent')
    }
    
    client.leave(roomId);

  }
  async closeRoom({client, roomId}){
    // Gets all connected socket to the room
    const room = client.sockets.adapter.rooms.get(roomId);
    
    if (room) {
      // Loop through each client in the room and make them leave
      room.forEach(clientId => {
        const socket = client.sockets.sockets.get(clientId);
        if (socket) {
          socket.leave(roomId);
        }
      });
    }
    // note and emit the individual who closed the room
  }
}

