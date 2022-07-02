import { Module } from '@nestjs/common';
import { ValidateWordService } from './validate-word.service';
import { ValidateWordController } from './validate-word.controller';

@Module({
  controllers: [ValidateWordController],
  providers: [ValidateWordService],
})
export class ValidateWordModule {}
