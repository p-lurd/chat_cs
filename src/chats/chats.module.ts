import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatDocument, ChatModelName, ChatSchema } from './schemas/chat.schema';
import { User, UserModelName, UserSchema, UserDocument  } from 'src/users/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';
import { WinstonLogger } from 'src/utilities/logger/winston-logger.service';

@Module({
  imports: [
    UsersModule,
      MongooseModule.forFeature([{name: ChatModelName, schema: ChatSchema},{name: UserModelName, schema: UserSchema}]
        
      )],
  providers: [ChatsGateway, ChatsService, WinstonLogger],
})
export class ChatsModule {}
