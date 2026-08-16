import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

function readCookie(req: { headers?: { cookie?: string } }, name: string): string | undefined {
  const raw = req.headers?.cookie;
  if (!raw) return undefined;
  const parts = raw.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return undefined;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    let token: string | undefined;

    if (auth) {
      const parts = auth.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') token = parts[1];
    }

    if (!token) {
      token = readCookie(req, 'admin_session');
    }

    if (!token) throw new UnauthorizedException();

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
