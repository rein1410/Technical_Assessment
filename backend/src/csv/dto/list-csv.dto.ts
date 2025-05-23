import { PartialType } from '@nestjs/mapped-types';
import { CreateCsvDto } from './create-csv.dto';
import { FilterParameter, ListQueryOptions, LogicalOperator, NullOptionals, SortParameter } from '@app/shared/common-types';
import { Csv } from '../entities/csv.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCsvDto extends PartialType(CreateCsvDto) {}

export class ListCsvDto {
    @ApiProperty({ required: false })
    skip?: number;

    @ApiProperty({ required: false })
    take?: number;

    @ApiProperty({ required: false, description: "search using postgres' full-text search engine"})
    search?: string;

    @ApiProperty({ required: false })
    email?: string;
}