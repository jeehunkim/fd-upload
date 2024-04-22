import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    // const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(' ')[1];
    const userid = req.headers?.userid;

    if (!userid) {
      throw new UnauthorizedException('No userid provided');
    }
    return handler.handle();
  }
}
