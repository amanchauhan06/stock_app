import { UserEntity } from 'src/users/entity/user.entity';

import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MasterAboutEntity } from './master.about.entity';
import { MasterFundamentalsEntity } from './master.fundamentals.entity';
import { StockDetailEntity } from './stock_detal.entity';

@Entity()
export class MasterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  tradingsymbol: String;
  @Column()
  name: String;
  @Column()
  instrument_type: String;
  @Column()
  segment: String;
  @Column()
  exchange: String;
  @Column()
  data_type: String;
  @Column()
  key: String;
  @Column()
  from: String;
  @Column()
  to: String;
  @OneToMany(() => StockDetailEntity, (entity) => entity.company)
  price: StockDetailEntity[];
  @ManyToMany(() => UserEntity)
  user: Promise<UserEntity[]>;
  @OneToOne(() => MasterFundamentalsEntity, { cascade: true })
  fundamentals: MasterFundamentalsEntity;
  @OneToOne(() => MasterAboutEntity, { cascade: true })
  about: MasterAboutEntity;
}
