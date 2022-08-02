import { MasterEntity } from 'src/stock_detail/master.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntityCompaniesMaster {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // @Column()
  // createdAt: Date;
  // @Column()
  // updatedAt: Date;
}
