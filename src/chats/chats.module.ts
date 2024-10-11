import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatDocument, ChatModelName, ChatSchema } from './schemas/chat.schema';
import { User, UserModelName, UserSchema, UserDocument  } from 'src/users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: ChatModelName, schema: ChatSchema},{name: UserModelName, schema: UserSchema}])],
  providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
