import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsvModule } from './csv/csv.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@app/shared';

@Module({
  imports: [
    SharedModule.forRoot({
      apiOptions: {
        queryLimit: 100,
      }
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'supersecret',
      database: 'database',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CsvModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
