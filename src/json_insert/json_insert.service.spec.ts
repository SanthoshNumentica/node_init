import { Test, TestingModule } from '@nestjs/testing';
import { JsonInsertService } from './json_insert.service';

describe('JsonInsertService', () => {
  let service: JsonInsertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonInsertService],
    }).compile();

    service = module.get<JsonInsertService>(JsonInsertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
