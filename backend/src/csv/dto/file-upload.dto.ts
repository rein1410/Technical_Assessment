import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: any;
}
