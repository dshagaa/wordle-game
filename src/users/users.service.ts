import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
      return await this.usersRepository.save(newUser);
    } catch (err) {
      throw new ConflictException(err.detail);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(uuid: string): Promise<UserEntity> {
    try {
      return await this.usersRepository.findOneOrFail({ where: { uuid } });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user: UserEntity = await this.findOne(uuid);
    user.username = updateUserDto.username || user.username;
    user.email = updateUserDto.email || user.email;
    user.password =
      GlobalHelper.crypto(updateUserDto.password) || user.password;
    try {
      return await this.usersRepository.update(user.id, user);
    } catch (err) {
      throw new ConflictException(err.message);
    }
  }

  async remove(uuid: string) {
    const user = await this.findOne(uuid);
    try {
      return await this.usersRepository.softRemove(user);
    } catch (err) {
      throw new ConflictException(err.message);
    }
  }
}
