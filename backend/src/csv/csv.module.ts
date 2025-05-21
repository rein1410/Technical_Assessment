import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Csv } from './entities/csv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Csv])],
  controllers: [CsvController],
  providers: [CsvService],
})
export class CsvModule {}
