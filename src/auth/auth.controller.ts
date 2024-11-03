import { Controller, Post, Body, UseGuards, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-guard.guard';
import { User } from 'src/users/schemas/user.schema';
import { unauthorisedUserException } from 'src/utilities/exceptions/httpExceptions';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

//   @Post('register')
//   async register(@Body() user: User) {
//     return this.authService.register(user);
//   }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateSupport(loginDto.email, loginDto.password);
    if (!user) {
      throw new unauthorisedUserException('100AC', 'Invalid login credientials')
    }
    return this.authService.login(user);
  }

//   @UseGuards(JwtAuthGuard)
//   @Post('profile')
//   getProfile(@Request() req) {
//     return req.user;
//   }
}

