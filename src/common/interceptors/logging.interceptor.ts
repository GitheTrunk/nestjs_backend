import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req?.method;
    const url = req?.url;
    const type = context.getType<string>();

    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        if (method && url) {
          console.log(`[HTTP] ${method} ${url} - ${ms}ms`);
          return;
        }

        const className = context.getClass()?.name ?? 'UnknownClass';
        const handlerName = context.getHandler()?.name ?? 'unknownHandler';
        console.log(`[${type.toUpperCase()}] ${className}.${handlerName} - ${ms}ms`);
      }),
    );
  }
}