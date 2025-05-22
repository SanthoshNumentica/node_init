import {
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import path from 'path';
import { JsonInsertService } from './json_insert.service';

@ApiTags('Json')
@ApiBearerAuth()
@Controller('json')
export class JsonInsertController {
  constructor(private readonly jsonInsertService: JsonInsertService) {}
  @Post('load/:tableName')
  async loadJson(@Param('tableName') tableName: string) {
    const filePath = path.join(
      __dirname,
      'src',
      'json-files',
      `${tableName}.json`,
    );

    if (fs.existsSync(filePath)) {
      try {
        await this.jsonInsertService.loadJsonAndInsertData(filePath, tableName);
        return {
          message: `JSON data for table ${tableName} loaded successfully.`,
        };
      } catch (error) {
        throw new InternalServerErrorException(
          `Failed to load JSON data for table ${tableName}.`,
        );
      }
    } else {
      throw new NotFoundException(
        `JSON file for table ${tableName} not found.`,
      );
    }
  }
}
