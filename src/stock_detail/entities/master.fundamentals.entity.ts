import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MasterEntity } from './master.entity';

@Entity()
export class MasterFundamentalsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  marketCap: string;
  @Column()
  roe: string;
  @Column()
  peRatio: string;
  @Column()
  pbRatio: string;
  @Column()
  eps: string;
  @Column()
  debtToEquity: string;
  @Column()
  industryPE: string;
  @Column()
  bookValue: string;
  @Column()
  faceValue: string;
  @Column()
  dividendYield: string;
  @OneToOne(() => MasterEntity)
  @JoinColumn()
  company: MasterEntity;
}
