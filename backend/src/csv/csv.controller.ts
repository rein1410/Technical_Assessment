import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { CsvService } from './csv.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { ListCsvDto } from './dto/list-csv.dto';
import { ILike } from 'typeorm';

@Controller('api/csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file upload',
    required: true,
    type: FileUploadDto,
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'text/csv',
            skipMagicNumbersValidation: true,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    return await this.csvService.upload(file.buffer);
  }

  @Get()
  findAll(@Query() query: ListCsvDto) {
    const { search, email } = query;
    return this.csvService.findAll(
      {
        where: {
          email: email ? ILike(`%${email}%`) : undefined,
        }
      },
      search,
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.csvService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCsvDto: UpdateCsvDto) {
  //   return this.csvService.update(+id, updateCsvDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.csvService.remove(+id);
  // }
}
