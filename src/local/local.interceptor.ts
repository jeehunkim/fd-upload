import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor {
  isTrue = false;

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(tap((data) => console.log(data)));
  }
}
