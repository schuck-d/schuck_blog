import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './article/article.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    // 加载连接数据库
    TypeOrmModule.forRoot({
      type: 'mysql', // 数据库类型
      host: '116.205.136.171', // 数据库ip地址
      port: 3306, // 端口
      username: 'schuck', // 登录名
      password: '!duxin1002', // 密码
      database: 'blog', // 数据库名称
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 扫描本项目中.entity.ts或者.entity.js的文件
      synchronize: true, // 定义数据库表结构与实体类字段同步(这里一旦数据库少了字段就会自动加入,根据需要来使用)
    }),
    AuthModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
