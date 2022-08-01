import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import {MailModule} from "../mail/mail.module";

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [MailModule]
})
export class BlogModule {}
