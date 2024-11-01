import { User } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { AuthService } from '@/auth/auth.service';
// import { AuthService } from '@/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  // 注册
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

  // 登录
  async login(loginUser: CreateUserDto) {
    console.log('JWT验证 - Step 1: 用户请求登录');
    const { username, password } = loginUser;

    // 校验当前用户
    const authResult = await this.authService.validateUser(username, password);

    switch (authResult.code) {
      case HttpStatus.OK:
        return this.authService.certificate(authResult.user);
      case HttpStatus.BAD_REQUEST:
        return {
          code: authResult.code,
          msg: '账号或密码不正确',
        };
      default:
        return {
          code: authResult.code,
          mgs: '当前用户不存在',
        };
    }

    // const user = await this.userRepository.findOne({
    //   where: { username },
    // });
    //
    // // 查询到当前用户
    // if (user) {
    //   if (user.username === username && user.password === password) {
    //     return user;
    //   }
    // } else {
    //   throw new HttpException('当前用户未注册', HttpStatus.BAD_REQUEST);
    // }
  }

  // 通过username查找当前用户
  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
