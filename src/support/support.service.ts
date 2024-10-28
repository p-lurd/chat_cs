import { HttpException, Injectable } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModelName } from 'src/users/schemas/user.schema';
import { uuid } from 'uuidv4';
import { unexpectedErrorException, userNotCreated } from 'src/utilities/exceptions/exceptions';
import { ROLES } from 'src/users/utililities/user.enum';

@Injectable()
export class SupportService {
  constructor(@InjectModel(UserModelName) private userModel: Model<UserDocument>){}

  async create(createSupportDto: CreateSupportDto) {
    try {
      const email = createSupportDto.email
      const name = createSupportDto.name
      const user = await this.userModel.findOne({ email: email})
      if(user) {
        return user
      }
      // if not a user, create a new user
      const roomId = await uuid()
      const newUser = await this.userModel.create({name, email, roomId, role: ROLES.support})
      return newUser;
    } catch (error) {
      if(error instanceof HttpException){
      throw new userNotCreated('101CS')
      }
      throw new unexpectedErrorException('102CS')
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
