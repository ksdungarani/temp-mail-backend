import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EmailsModule } from './emails/emails.module';
import { Connection } from 'mongoose';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Connect to MongoDB using async factory to handle errors safely
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
          throw new Error('MONGODB_URI not defined in .env');
        }
        return { uri: mongoUri };
      },
    }),

    // Emails feature module
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    // Log when MongoDB connection is established
    this.connection.once('open', () => {
      console.log('✅ MongoDB connection established!');
    });

    // Log connection errors
    this.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
  }
}
