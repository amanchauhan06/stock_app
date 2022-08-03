import { Column, Entity, PrimaryColumn, Timestamp } from "typeorm";

@Entity("order")
export class OrderEntity {
    @PrimaryColumn('uuid')
    id: any;
    @Column()
    price: number;
    @Column()
    last_price: number;
    @Column()
    traded_quantity: number;
    @Column()
    name: string;
    @PrimaryColumn()
    updated_at: Date;
  }