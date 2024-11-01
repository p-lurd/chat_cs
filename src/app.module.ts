import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModule } from './chats/chats.module';
import { SupportModule } from './support/support.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'; 




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule globally available
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UsersModule,
    ChatsModule,
    SupportModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
