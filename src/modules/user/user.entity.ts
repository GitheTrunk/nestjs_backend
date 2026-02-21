import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "../task/task.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;
    
    @Column()
    password: string;

    @OneToMany(() => Task, task => task.user)
    tasks: Task[];  
}