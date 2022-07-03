import {
  BeforeInsert,
  BeforeSoftRemove,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GlobalHelper } from '../../helpers/global.helper';
import { RecordsEntity } from '../../validate-word/entities/records.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'uuid', unique: true })
  uuid: string;
  @Column({ type: 'varchar', length: 191, unique: true })
  username: string;
  @Column({ type: 'varchar', length: 191, unique: true })
  email: string;
  @Column({ type: 'varchar', length: 191 })
  password: string;
  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  token: string;
  @Column({ type: 'timestamp', default: null, nullable: true })
  created_at: string;
  @Column({ type: 'timestamp', default: null, nullable: true })
  updated_at: string;
  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deleted_at: string;
  @OneToMany(() => RecordsEntity, (record) => record.user)
  records: RecordsEntity[];

  @BeforeInsert()
  insert() {
    this.uuid = GlobalHelper.uuid();
    this.created_at = GlobalHelper.getCurrentDateTime();
  }

  @BeforeUpdate()
  update() {
    this.updated_at = GlobalHelper.getCurrentDateTime();
  }

  @BeforeSoftRemove()
  softRemove() {
    this.deleted_at = GlobalHelper.getCurrentDateTime();
  }
}
