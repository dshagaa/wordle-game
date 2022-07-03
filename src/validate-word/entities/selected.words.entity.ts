import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GlobalHelper } from '../../helpers/global.helper';
import { RecordsEntity } from './records.entity';

@Entity('selected_words')
export class SelectedWordsEntity {
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
