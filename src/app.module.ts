import { Module } from '@nestjs/common';
import {BlogModule} from "./blog/blog.module";
import {UserModule} from "./user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BlogEntity} from "./blog/entities/blog.entity";
import {UserEntity} from "./user/entities/user.entity";
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ContactModule } from './contact/contact.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot(), BlogModule, UserModule, AuthModule, TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.HOST,
    port: +process.env.PORT,
    username: process.env.USER,
    password: process.env.PWD,
    database: process.env.DB,
    entities: [BlogEntity, UserEntity],
    synchronize: true,
  }), MailModule, ContactModule],
})
export class AppModule {}
