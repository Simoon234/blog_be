import {Inject, Injectable} from '@nestjs/common';
import {MailerService} from "@nest-modules/mailer";

@Injectable()
export class MailService {
    constructor(@Inject(MailerService) private readonly mailerService: MailerService) {
    }

    async sendMail(to: string, subject: string, html: string): Promise<any> {
        try {
            return this.mailerService.sendMail({
                to,
                subject,
                html
            })
        } catch (e) {
            throw new Error(e);
        }

    }
}
