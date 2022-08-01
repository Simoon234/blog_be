import {Inject, Injectable} from '@nestjs/common';
import {MailService} from "../mail/mail.service";

@Injectable()
export class ContactService {
    constructor(@Inject(MailService) private mailService: MailService){}

}
