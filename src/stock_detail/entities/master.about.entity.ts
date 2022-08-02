import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MasterEntity } from './master.entity';

@Entity()
export class MasterAboutEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  description: string;
  @Column()
  parent: string;
  @Column()
  founded: string;
  @Column()
  managingDirector: string;
  @OneToOne(() => MasterEntity)
  @JoinColumn()
  company: MasterEntity;
}
