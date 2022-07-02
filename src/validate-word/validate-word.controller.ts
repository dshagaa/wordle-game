import { Body, Controller, Post } from '@nestjs/common';
import { ValidateWordService } from './validate-word.service';
import { ValidateWordDto } from './dto/validate-word.dto';

@Controller('validate-word')
export class ValidateWordController {
  constructor(private readonly validateWordService: ValidateWordService) {}

  @Post()
  validate(@Body() dto: ValidateWordDto) {
    return this.validateWordService.validate(dto);
  }
}
