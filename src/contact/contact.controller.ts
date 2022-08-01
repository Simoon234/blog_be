import {Body, Controller, Inject, Post} from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import {Mail} from "../mail/dto/new-mail.dto";

@Controller('contact')
export class ContactController {
    constructor(@Inject(MailService) private mailService: MailService) {
    }

    @Post('/')
    sendMail(@Body() mail: Mail) {
        return this.mailService.sendMail(mail.to, mail.subject, mail.html);
    }
}
