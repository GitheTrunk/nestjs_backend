import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('receipts')
export class Receipt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp' })
    issuedAt: Date;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'float' })
    price: number;
}
