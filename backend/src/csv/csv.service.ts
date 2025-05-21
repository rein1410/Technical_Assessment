import { Injectable } from '@nestjs/common';
import { CreateCsvDto } from './dto/create-csv.dto';
import { UpdateCsvDto } from './dto/update-csv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Csv } from './entities/csv.entity';
import { parse } from 'csv-parse';

@Injectable()
export class CsvService {
  constructor(
    @InjectRepository(Csv)
    private readonly csvRepository: Repository<Csv>,
  ) {}

  async upload(buffer: Buffer) {
    const entities = [];
    const parser = parse(buffer, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
    });
    for await (const record of parser) {
      entities.push(new Csv(record));
    }
    // Skip if id is present
    await this.csvRepository
      .createQueryBuilder()
      .insert()
      .values(entities)
      .orIgnore() // Skip inserting rows that would violate constraints
      .execute();
    return entities;
  }

  create(createCsvDto: CreateCsvDto) {
    return this.csvRepository.save(new Csv(createCsvDto));
  }

  findAll() {
    return `This action returns all csv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} csv`;
  }

  update(id: number, updateCsvDto: UpdateCsvDto) {
    return `This action updates a #${id} csv`;
  }

  remove(id: number) {
    return `This action removes a #${id} csv`;
  }
}
