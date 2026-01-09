import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '../../users/types/jwt-user';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtUser }>();
    return request.user;
  },
);
