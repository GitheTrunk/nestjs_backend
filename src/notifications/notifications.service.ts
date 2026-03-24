import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class NotificationsService {
    constructor(
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService,
    ) {}

    notify(event: string, payload: any) {
        console.log(`[NOTIFY] ${event}`, payload);
        return { ok: true };
    }
}
