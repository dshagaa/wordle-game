import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AnsweredWordsEntity } from './answered.words.entity';
import { SelectedWordsEntity } from './selected.words.entity';

@Entity('records')
export class RecordsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('uuid')
  uuid: string;
  @Column('uuid')
  user_id: string;
  @Column('uuid')
  selected_word_id: string;
  @Column('uuid')
  answered_word_id: string;
  @Column({ type: 'int4', width: 1, default: 0 })
  intents_count: number;
  @Column({ type: 'timestamp', default: null, nullable: true })
  created_at: string;
  @Column({ type: 'timestamp', default: null, nullable: true })
  updated_at: string;
  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deleted_at: string;

  @ManyToOne(() => UserEntity, (user) => user.records, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'uuid' })
  user: UserEntity;
  @ManyToOne(() => AnsweredWordsEntity, (answer) => answer.records, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'answered_word_id', referencedColumnName: 'uuid' })
  answerWord: AnsweredWordsEntity;
  @ManyToOne(() => SelectedWordsEntity, (answer) => answer.records, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'selected_word_id', referencedColumnName: 'uuid' })
  selectedWord: SelectedWordsEntity;
}
