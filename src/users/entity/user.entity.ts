import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity{
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
}
