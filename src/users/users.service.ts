import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { GlobalHelper } from '../helpers/global.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.email = createUserDto.email;
    newUser.username = createUserDto.username;
    newUser.password = GlobalHelper.crypto(createUserDto.password);
    try {
      const user = await this.usersRepository.save(newUser);
      delete user.id;
      delete user.password;
      return user;
    } catch (err) {
      throw new ConflictException(err.detail);
    }
  }
}
