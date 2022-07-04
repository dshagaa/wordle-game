import { Body, Controller, Get, Logger, Post, Request } from '@nestjs/common';
import { ValidateWordService } from './validate-word.service';
import { ValidateWordDto } from './dto/validate-word.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('validate-word')
export class ValidateWordController {
  constructor(private readonly validateWordService: ValidateWordService) {}

  @Post()
  validate(@Request() req: any, @Body() dto: ValidateWordDto) {
    const data = {
      ...dto,
      user_id: req.$auth.uuid,
    };
    return this.validateWordService.validate(data);
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'renewSelectedWord',
    timeZone: 'utc',
  })
  @Get('/renew-word')
  renewWord() {
    Logger.debug('Changing selected word...');
    return this.validateWordService.renew();
  }
}
