import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument, ChatModelName, ChatSchema } from './schemas/chat.schema';
import { User, UserModelName, UserSchema, UserDocument  } from 'src/users/schemas/user.schema';
import { UserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatModelName) private readonly chatModel: Model<ChatDocument>,  // Inject Chat model
    @InjectModel(UserModelName) private readonly userModel: Model<UserDocument>   // Inject User model
  ) {}
  async create(createChatDto: CreateChatDto) {
    console.log("newMesssage: ", createChatDto)
    const { message, userId } = createChatDto;
    const user = await this.userModel.findOne({ id: userId})
    if(!user) {
      throw new HttpException({error: "User not found", int: "CC100"}, HttpStatus.NOT_FOUND)
    }
    const chat = await this.chatModel.create({
      name: user.name,
      message,
      userId,
    })
    
    return chat;
  }

  findAll() {
    return `This action returns all chats`;
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
    const user: UserDto = await this.userModel.findOne({ id: userId})
    const roomId = user.roomId;
    if (!roomId) {

      // generate a new roomId

      console.log('roomId absent')
    }

    client.join(roomId);

  }

  async leaveRoom({client, userId}){
    const user: UserDto = await this.userModel.findOne({ id: userId})
    const roomId = user.roomId;
    if (!roomId) {

      // generate a new roomId

      console.log('roomId absent')
    }
    
    client.leave(roomId);

  }
}

