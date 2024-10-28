import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModule } from './chats/chats.module';
import { SupportModule } from './support/support.module';
import * as dotenv from 'dotenv';
dotenv.config();

const DB_URL = process.env.DB_URL


@Module({
  imports: [MongooseModule.forRoot(DB_URL), UsersModule, ChatsModule, SupportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
