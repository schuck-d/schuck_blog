import { User } from './entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async register(createUser: CreateUserDto) {
    const { username } = createUser;

    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }

  async login(loginUser: CreateUserDto) {
    const { username, password } = loginUser;

    const user = await this.userRepository.findOne({
      where: { username },
    });

    // 查询到当前用户
    if (user) {
      if (user.username === username && user.password === password) {
        return user;
      }
    } else {
      throw new HttpException('当前用户未注册', HttpStatus.BAD_REQUEST);
    }
  }
}
