import { Module } from '@nestjs/common';
import { JsonInsertService } from './json_insert.service';

@Module({
  providers: [JsonInsertService],
  exports: [JsonInsertService],
})
export class JsonInsertModule {}
