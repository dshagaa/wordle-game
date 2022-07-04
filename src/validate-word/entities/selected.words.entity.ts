import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GlobalHelper } from '../../helpers/global.helper';
import { RecordsEntity } from './records.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('selected_words')
export class SelectedWordsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'uuid', unique: true })
  uuid: string;
  @Column({ type: 'varchar', length: 10 })
  word: string;
  @Column({ type: 'uuid' })
  user_id: string;

  @BeforeInsert()
  insert() {
    this.uuid = GlobalHelper.uuid();
  }

  @OneToMany(() => RecordsEntity, (record) => record.user)
  records: RecordsEntity[];
  @ManyToOne(() => UserEntity, (user) => user.selectedWords)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'uuid' })
  user: UserEntity;
}
