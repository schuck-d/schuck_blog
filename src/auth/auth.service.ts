import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { isOk } from '@/utils/bcrypt';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // jwt验证 - step 2: 校验用户信息
  async validateUser(username: string, password: string) {
    console.log('jwt验证 - step 2: 校验用户信息');
    const user = await this.userService.findOne(username);

    if (user) {
      const hashedPassword = user.password;

      // 通过密码加盐，再进行比较
      if (isOk(password, hashedPassword)) {
        // 密码正确
        return {
          code: HttpStatus.OK,
          user,
        };
        // 密码错误
      } else {
        return {
          code: HttpStatus.BAD_REQUEST,
          user: null,
        };
      }
    } else {
      // 没有当前用户
      return {
        code: HttpStatus.NOT_FOUND,
        user: null,
      };
    }
  }

  // JWT验证 - step 3: 处理jwt签证
  async certificate(user: User) {
    const payLoad = {
      username: user.username,
      sub: user.id,
      realName: user.nickname,
      role: user.role,
    };

    try {
      const token = this.jwtService.sign(payLoad);
      console.log('JWT验证 - step 3: 处理jwt签证');
      return {
        code: HttpStatus.OK,
        data: {
          token,
        },
        msg: '登录成功',
      };
    } catch (e) {
      console.log('error---------certificate()', e);
      return {
        code: HttpStatus.UNAUTHORIZED,
        msg: '账号或密码错误',
      };
    }
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
