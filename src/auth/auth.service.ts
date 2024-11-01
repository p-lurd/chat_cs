import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupportService } from 'src/support/support.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { UserDocument, UserModelName } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private supportService: SupportService,
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(UserModelName) private userModel: Model<UserDocument>,
  ) {}

  async validateSupport(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const{email, _id, role} = user._doc
    const payload = { email: email, _id, role};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
