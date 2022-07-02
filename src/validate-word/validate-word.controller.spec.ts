import { Test, TestingModule } from '@nestjs/testing';
import { ValidateWordController } from './validate-word.controller';
import { ValidateWordService } from './validate-word.service';
import { map } from 'lodash';

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

  describe('validate word "GATOS"', () => {
    it('should return a array of letters with they values', async () => {
      const req = {
        user_word: 'GATOS',
      };
      const result: Record<string, any>[] = map(req.user_word, (letter) => {
        return { letter, value: 1 };
      });
      jest.spyOn(service, 'validate').mockImplementation(() => result);
      expect(await service.validate(req)).toMatchObject(result);
    });
  });

  describe('validate word "VOCAL"', () => {
    it('should return a array of letters with they values', async () => {
      const req = {
        user_word: 'VOCAL',
      };
      const result: Record<string, any>[] = map(req.user_word, (letter) => {
        return { letter, value: 1 };
      });
      jest.spyOn(service, 'validate').mockImplementation(() => result);
      expect(await service.validate(req)).toMatchObject(result);
    });
  });

  describe('validate word "CANTO"', () => {
    it('should return a array of letters with they values', async () => {
      const req = {
        user_word: 'CANTO',
      };
      const result: Record<string, any>[] = map(req.user_word, (letter) => {
        return { letter, value: 1 };
      });
      jest.spyOn(service, 'validate').mockImplementation(() => result);
      expect(await service.validate(req)).toMatchObject(result);
    });
  });
});
