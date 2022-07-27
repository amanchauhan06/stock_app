import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StockDetailEntity } from "./stock_detal.entity";

@Entity()
export class MasterEntity{
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
    price: StockDetailEntity[]
}
