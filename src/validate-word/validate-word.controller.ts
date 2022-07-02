import { Body, Controller, Get, Post } from '@nestjs/common';
import { ValidateWordService } from './validate-word.service';
import { ValidateWordDto } from './dto/validate-word.dto';
import { GetStoredWordList } from '../helpers/validate.word.helper';

@Controller('validate-word')
export class ValidateWordController {
  constructor(private readonly validateWordService: ValidateWordService) {}

  @Post()
  validate(@Body() dto: ValidateWordDto) {
    return this.validateWordService.validate(dto);
  }

  @Get('list')
  async getList() {
    const list = await GetStoredWordList();
    return { list };
  }
}
