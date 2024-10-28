import { Injectable, Req, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserModelName, UserSchema, UserDocument } from './schemas/user.schema';
import { uuid } from 'uuidv4';
import { userNotCreated } from 'src/utilities/exceptions/exceptions';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModelName) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const email = createUserDto.email
      const name = createUserDto.name
      const user = await this.userModel.findOne({ email: email})
      if(user) {
        return user
      }
      // if not a user, create a new user
      const roomId = await uuid()
      const newUser = await this.userModel.create({name, email, roomId})
      return newUser;
    } catch (error) {
      throw new userNotCreated('100CU')
    }
    
  }

  findAll() {
    // const email = createUserDto.email
    // const user = await UserSchema.findOne({email})
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
