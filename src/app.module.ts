import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiptsModule } from './receipts/receipts.module';
import { Receipt } from './receipts/entities/receipt.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_NAME ?? 'dev.sqlite',
      entities: [Receipt],
      synchronize: true,
    }),
    ReceiptsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
