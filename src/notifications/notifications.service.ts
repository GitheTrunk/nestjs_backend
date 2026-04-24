import { Inject, Injectable } from '@nestjs/common';
import { EVENT_PUBLISHER } from '../core/tokens';

type EventPublisher = {
    publish: (event: string, payload: any) => void;
};

@Injectable()
export class NotificationsService {
    constructor(
        @Inject(EVENT_PUBLISHER)
        private readonly publisher: EventPublisher,
    ) {}

    notify(event: string, payload: any) {
        this.publisher.publish(event, payload);
        // console.log(`[NOTIFY] ${event}`, payload);
        return { ok: true };
    }
}
