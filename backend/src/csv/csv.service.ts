import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCsvDto } from './dto/create-csv.dto';
import { UpdateCsvDto } from './dto/list-csv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  EntityManager,
  FindManyOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Csv } from './entities/csv.entity';
import { parse } from 'csv-parse';
import { ListQueryBuilder } from '@app/shared/helpers/list-query-builder';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CsvService {
  constructor(
    @InjectRepository(Csv)
    private readonly csvRepository: Repository<Csv>,
    private readonly listQueryBuilder: ListQueryBuilder,
    private readonly entityManager: EntityManager,
  ) {}

  async upload(buffer: Buffer) {
    let entities: Csv[] = [];
    const parser = parse(buffer, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
    });

    await this.entityManager.transaction(async (entityManager) => {
      for await (const record of parser) {
        const dto = plainToInstance(CreateCsvDto, record);
        const errors = await validate(dto);
        if (errors.length > 0) throw new BadRequestException(errors);
        entities.push(new Csv(dto));
        if (entities.length > 250) {
          entityManager
            .createQueryBuilder()
            .insert()
            .into(Csv)
            .values(entities)
            .orIgnore() // Skip inserting rows that would violate constraints
            .execute();
          entities = [];
        }
      }
      if (entities.length > 0) await this.csvRepository
        .createQueryBuilder()
        .insert()
        .values(entities)
        .orIgnore() // Skip inserting rows that would violate constraints
        .execute();
    });
    return entities;
  }

  create(createCsvDto: CreateCsvDto) {
    return this.csvRepository.save(new Csv(createCsvDto));
  }

  findAll(options?: FindManyOptions<Csv>, search?: string) {
    const qb = this.listQueryBuilder.build(Csv, options);

    if (search) {
      this.applyfullTextSearch(qb, search);
    }

    return qb.getManyAndCount().then(([items, totalItems]) => ({
      items,
      totalItems,
    }));
  }

  applyfullTextSearch(qb: SelectQueryBuilder<Csv>, search: string) {
    qb.addSelect(
      `
      (
      ts_rank_cd(to_tsvector('csv.body'), to_tsquery(plainto_tsquery(:term)::text)) * 2 +
      ts_rank_cd(to_tsvector('csv.name'), to_tsquery(plainto_tsquery(:term)::text)) +
      ts_rank_cd(to_tsvector('csv.email'), to_tsquery(plainto_tsquery(:term)::text))
      )
      `,
      'score',
    )
      .andWhere(
        new Brackets((qb1) => {
          qb1
            .where(
              'to_tsvector(csv.body) @@ to_tsquery(plainto_tsquery(:term)::text)',
            )
            .orWhere(
              'to_tsvector(csv.name) @@ to_tsquery(plainto_tsquery(:term)::text)',
            )
            .orWhere(
              'to_tsvector(csv.email) @@ to_tsquery(plainto_tsquery(:term)::text)',
            )
            .orWhere('csv.name ILIKE :ilikeTerm')
            .orWhere('csv.email ILIKE :ilikeTerm')
            .orWhere('csv.body ILIKE :ilikeTerm');
        }),
      )
      .addOrderBy('score', 'DESC')
      .setParameters({
        term: `${search}`,
        ilikeTerm: `%${search}%`,
      });

    console.log(qb.getQueryAndParameters());
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
