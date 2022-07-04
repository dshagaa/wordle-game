import { Test, TestingModule } from '@nestjs/testing';
import { ValidateWordService } from './validate-word.service';

describe('ValidateWordService', () => {
  let service: ValidateWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateWordService],
    }).compile();

    service = module.get<ValidateWordService>(ValidateWordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
