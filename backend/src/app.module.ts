import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsvModule } from './csv/csv.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // TypeOrmModule.forFeature([])
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'supersecret',
      database: 'database',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CsvModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
