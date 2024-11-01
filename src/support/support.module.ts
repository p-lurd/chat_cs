import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatDocument, ChatModelName, ChatSchema } from 'src/chats/schemas/chat.schema';
import { User, UserModelName, UserSchema, UserDocument  } from 'src/users/schemas/user.schema';
import { TicketModelName, TicketSchema } from './schema/ticket.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: ChatModelName, schema: ChatSchema},{name: UserModelName, schema: UserSchema},{name: TicketModelName, schema: TicketSchema}])],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService]
})
export class SupportModule {}
