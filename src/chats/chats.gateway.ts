import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateUserDto, UserDto } from 'src/users/dto/create-user.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // or specify your frontend origin
    methods: ['GET', 'POST'],
  },
})
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.query.userId;
      console.log('userId: ' + userId);
      if (!userId) {
        client.disconnect();
        return;
      }
  
      this.chatsService.joinRoom({client, userId});
      console.log('Client connected:', client.id);
      return
    } catch (error) {
      client.disconnect();
      console.error('error connecting:', error)
      return new Error(`unable to join room:` + error);
      
    }


    // auto leave the room after 5mins timeout(can usecronjobs)
    // when ticket is closed, all user leave room auto
  }

  handleDisconnect(client: any) {
    try {
      const userId = client.handshake.query.userId;
      if (!userId) {
        client.disconnect();
        return;
      }
      this.chatsService.leaveRoom({client, userId});
      console.log('Client disconnected:', client.id);
    } catch (error) {
      client.disconnect();
      console.error('error disconnecting:', error)
      return new Error(`unable to leave room:` + error);
    }

  }

  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto, client: Socket) {
    return this.chatsService.create(createChatDto, this.server);
  }

  @SubscribeMessage('findAllChats')
  findAll() {
    return this.chatsService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatsService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatsService.remove(id);
  }
}
