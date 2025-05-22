import { Test, TestingModule } from '@nestjs/testing';
import { JsonInsertController } from './json_insert.controller';

describe('JsonInsertController', () => {
  let controller: JsonInsertController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonInsertController],
    }).compile();

    controller = module.get<JsonInsertController>(JsonInsertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
