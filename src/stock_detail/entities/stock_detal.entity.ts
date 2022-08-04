import { Column, Double, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MasterEntity } from "./master.entity";

@Entity()
export class StockDetailEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    timestamp: Date;
    @Column({type: 'float',})
    open: Double;
    @Column({type: 'float',})
    high: Double;
    @Column({type: 'float',})
    low: Double;
    @Column({type: 'float',})
    close: Double;
    @Column()
    volume: number;
    @ManyToOne(() => MasterEntity, (masterEntity) => masterEntity.price)
    company: MasterEntity;
}
