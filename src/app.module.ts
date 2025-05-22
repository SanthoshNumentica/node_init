import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JsonInsertModule } from './json_insert/json_insert.module';
import { PrismaModule } from './prisma/prisma.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    AuthModule,
    PrismaModule,
    SmsModule,
    JsonInsertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
