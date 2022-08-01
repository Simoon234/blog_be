import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UserModule} from "../user/user.module";
import {JwtStr} from "./jwt.strategy";
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [UserModule, MailModule],
    providers: [AuthService, JwtStr],
    exports: [JwtStr],
    controllers: [AuthController]
})
export class AuthModule {
}
