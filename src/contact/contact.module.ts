import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [MailModule]
})
export class ContactModule {}
