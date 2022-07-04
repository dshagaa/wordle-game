import { Controller, Get, Request } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('history')
  history(@Request() req: any) {
    const { uuid: user_id } = req.$auth;
    return this.leaderboardService.history(user_id);
  }

  @Get('most-matched-words')
  mostMatchedWords() {
    return this.leaderboardService.mostMatchedWords();
  }
}
