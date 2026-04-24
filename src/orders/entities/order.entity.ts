import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'timestamp' })
	orderedAt!: Date;

	@Column({ type: 'varchar', length: 255 })
	customerName!: string;

	@Column({ type: 'int' })
	quantity!: number;

	@Column({ type: 'float' })
	totalAmount!: number;

	@Column({ type: 'varchar', length: 32, default: 'pending' })
	status!: string;
}
