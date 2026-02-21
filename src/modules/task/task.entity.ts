import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'datetime', nullable: true  })
    createdAt: Date;

    @Column({ type: 'datetime', nullable: true })
    completedAt: Date;

    @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
    user: User;
}