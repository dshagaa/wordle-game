import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { UserEntity } from './users/entities/user.entity';
import { GlobalHelper } from './helpers/global.helper';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login(body: Record<string, any>) {
    const { email, password } = body;
    if (!email) {
      throw new UnprocessableEntityException('email_field_empty');
    }
    if (!password) {
      throw new UnprocessableEntityException('password_field_empty');
    }
    const user = await this.userRepository.findOne({
      where: {
        email: Like(email),
        password: Like(GlobalHelper.crypto(password)),
      },
    });
    if (!user) {
      throw new NotFoundException('email_or_password_wrong');
    }
    user.auth_token = nanoid(50);
    const result = await this.userRepository.save(user);
    delete result.password;
    delete result.id;
    delete result.deleted_at;
    return result;
  }
}
