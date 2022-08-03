import { MasterEntity } from 'src/stock_detail/entities/master.entity';
import {
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  mobile: string;
  @Column()
  email: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  refreshToken: string;
  @ManyToMany(() => MasterEntity)
  @JoinTable()
  companies: Promise<MasterEntity[]>;
}
