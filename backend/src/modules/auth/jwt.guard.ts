import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string;
    if (!auth) throw new UnauthorizedException();
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') throw new UnauthorizedException();
    try {
      const payload = jwt.verify(parts[1], JWT_SECRET);
      req.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
