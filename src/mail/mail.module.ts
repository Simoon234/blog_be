import {Module} from '@nestjs/common';
import {MailService} from './mail.service';
import {MailerModule} from "@nest-modules/mailer";
import mailConfig = require("../mail.config");


@Module({
    imports: [MailerModule.forRoot(mailConfig)],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
}
