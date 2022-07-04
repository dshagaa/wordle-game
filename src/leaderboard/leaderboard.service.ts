import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { RecordsEntity } from '../validate-word/entities/records.entity';
import { filter, size, sumBy } from 'lodash';

@Injectable()
export class LeaderboardService {
  async history(user_id: string) {
    const recordsRepository = getRepository(RecordsEntity);
    const games = await recordsRepository.find({
      relations: ['answerWord', 'selectedWord'],
      where: {
        user_id,
      },
    });
    return {
      total_games: size(games),
      total_intents: sumBy(games, 'intents_count'),
      total_wins: size(
        filter(games, (game) => {
          return game.answerWord.word === game.selectedWord.word;
        }),
      ),
    };
  }
}
