import {
  HttpService,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { getRepository, Like } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { replace } from 'lodash';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  constructor(private httpService: HttpService) {}

  async use(req: any, res: any, next: (error?: any) => void): Promise<any> {
    const token = replace(req.headers.authorization, 'Bearer ', '');
    const user = await getRepository(UserEntity).findOne({
      where: {
        auth_token: Like(token),
      },
    });
    if (!user) {
      throw new UnauthorizedException('invalid_token');
    }
    req.$auth = user;
    next();
  }
}
