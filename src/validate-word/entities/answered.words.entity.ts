import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GlobalHelper } from '../../helpers/global.helper';
import { RecordsEntity } from './records.entity';

@Entity('answered_words')
export class AnsweredWordsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'uuid', unique: true })
  uuid: string;
  @Column({ type: 'varchar', length: 10 })
  word: string;
  @OneToMany(() => RecordsEntity, (record) => record.user)
  records: RecordsEntity[];

  @BeforeInsert()
  insert() {
    this.uuid = GlobalHelper.uuid();
  }
}
