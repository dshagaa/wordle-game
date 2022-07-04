import { Test, TestingModule } from '@nestjs/testing';
import { ValidateWordController } from './validate-word.controller';
import { ValidateWordService } from './validate-word.service';

describe('ValidateWordController', () => {
  let controller: ValidateWordController;
  let service: ValidateWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidateWordController],
      providers: [ValidateWordService],
    }).compile();

    controller = module.get<ValidateWordController>(ValidateWordController);
    service = module.get<ValidateWordService>(ValidateWordService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
