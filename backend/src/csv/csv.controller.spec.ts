import { Test, TestingModule } from '@nestjs/testing';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { parse } from 'csv-parse/.';
import { plainToInstance } from 'class-transformer';
import { CreateCsvDto } from './dto/create-csv.dto';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { Csv } from './entities/csv.entity';
import { ListQueryBuilder } from '@app/shared/helpers/list-query-builder';

const mockUploadFn = async (buffer: Buffer) => {
  const entities = [];
  const parser = parse(buffer, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  });
  for await (const record of parser) {
    const dto = plainToInstance(CreateCsvDto, record);
    const errors = await validate(dto);
    if (errors.length > 0) throw new BadRequestException(errors);
    entities.push(new Csv(dto));
  }
  return entities;
};

describe('CsvController', () => {
  let controller: CsvController;
  let service: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsvController],
      providers: [
        {
          provide: CsvService,
          useValue: {
            upload: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: ListQueryBuilder,
          useValue: {
            build: {
              getManyAndCount: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<CsvController>(CsvController);
    service = module.get<CsvService>(CsvService);
  });

  describe('upload', () => {
    it('should call csvService.upload', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from(`"postId","id","name","email","body"\n
"1","1","name","test@test.com","body"`),
      } as Express.Multer.File;
      const result = [
        {
          id: '1',
          postId: '1',
          name: 'name',
          email: 'test@test.com',
          body: 'body',
        },
      ];
      jest.spyOn(service, 'upload').mockImplementation(mockUploadFn);
      expect(controller).toBeDefined();
      const response = await controller.uploadFile(mockFile);
      expect(service.upload).toHaveBeenCalledWith(mockFile.buffer);
      expect(response).toEqual(result);
    });
    it('should fail on validation', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from(`"postId","id","name","email","body"\n
"1","abc","name","test.com","body"`),
      } as Express.Multer.File;
      jest.spyOn(service, 'upload').mockImplementation(mockUploadFn);
      expect(controller).toBeDefined();
      try {
        await controller.uploadFile(mockFile);
        fail('Expected Error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findAll', () => {
    it('should call csvService.findAll', async () => {
      const csvs = [{
        id: 1,
        postId: 1,
        name: 'name',
        email: 'XXXXXXXXXXXXX',
        body: 'body',
      }];
      const result = {
        items: csvs,
        totalItems: csvs.length,
      };
      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        return {
          items: csvs.map(d => new Csv(d)),
          totalItems: csvs.length
        };
      });
      expect(controller).toBeDefined();
      const response = await controller.findAll({});
      expect(service.findAll).toHaveBeenCalled();
      expect(response).toEqual(result);
    });
  });
});
