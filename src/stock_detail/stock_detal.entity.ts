import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MasterEntity } from "./master.entity";

@Entity()
export class StockDetailEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    timestamp: Date;
    @Column()
    open: number;
    @Column()
    high: number;
    @Column()
    low: number;
    @Column()
    close: number;
    @Column()
    volume: number;
    @Column()
    company: string;
}
