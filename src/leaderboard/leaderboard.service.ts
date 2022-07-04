import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { RecordsEntity } from '../validate-word/entities/records.entity';
import {
  each,
  filter,
  groupBy,
  orderBy,
  size,
  sortBy,
  sumBy,
  take,
} from 'lodash';
import { UserEntity } from '../users/entities/user.entity';

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

  async mostMatchedWords() {
    const recordsRepository = getRepository(RecordsEntity);
    const winnedGames = filter(
      await recordsRepository.find({
        relations: ['answerWord', 'selectedWord'],
      }),
      (game) => {
        return game.answerWord.word === game.selectedWord.word;
      },
    );
    const mostMatchedWords = [];
    each(Object.entries(groupBy(winnedGames, 'selectedWord.word')), (item) => {
      const [word, records] = item;
      mostMatchedWords.push({
        word,
        amount: size(records),
      });
    });
    return orderBy(mostMatchedWords, { amount: 'DESC' });
  }

  async topTenWinners() {
    const users = await getRepository(UserEntity).find();
    const promises = [];
    each(users, (user, index: number) => {
      promises[index] = new Promise((resolve, reject) => {
        this.history(user.uuid).then((response) => {
          const { total_wins } = response;
          resolve({
            username: user.username,
            email: user.email,
            wins: total_wins,
          });
        });
      });
    });
    const winners = await Promise.all(promises).then((result) => result);
    return take(sortBy(winners, 'wins'), 10);
  }
}
