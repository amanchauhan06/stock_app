import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MasterEntity } from "./master.entity";

@Entity()
export class StockDetailEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    timestamp: Date;
    @Column()
    open: Number;
    @Column()
    high: Number;
    @Column()
    low: Number;
    @Column()
    close: Number;
    @Column()
    volume: Number;
    @ManyToOne(() => MasterEntity, masterEntity => masterEntity.price)
    company: MasterEntity
}
