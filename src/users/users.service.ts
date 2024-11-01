import { HttpException,Injectable, Req, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserModelName, UserSchema, UserDocument } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { failedUpdateException, userAlreadyExists, userNotCreated } from 'src/utilities/exceptions/httpExceptions';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModelName) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const {email, name} = createUserDto
      const user = await this.userModel.findOne({ email: email})
      if(user) {
        throw new userAlreadyExists('101CU')
      }
      // if not a user, create a new user
      const roomId = await uuidv4()
      const newUser = await this.userModel.create({name, email, roomId})
      return newUser;
    } catch (error) {
      if(error instanceof HttpException){
        throw error
        }
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

  async updateRoom(updateUserDto: UpdateUserDto) {
    const {_id, roomId} = updateUserDto
    await this.userModel.updateOne({ _id: _id}, { roomId: roomId },function (err, docs) {
      if (err){
          console.log(err)
          throw new failedUpdateException('CC102', 'user update failed: roomId')
      }
      else{
          console.log("Updated Docs : ", docs);
      }
      })
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


  async getUserById(userId){
    const user: UserDto = await this.userModel.findOne({_id: userId})
    return user
  }
}
