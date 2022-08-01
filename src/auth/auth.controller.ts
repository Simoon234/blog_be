import {Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LogUserReq} from "./types";
import {Response} from 'express';
import {UserObj} from "../decorators/user-obj.decorator";
import {JwtStrategy} from "./guards/jwtGuard.guard";

export interface UserPassword {
    email: string;
}


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }


    @Post('/login')
    logUser(
        @Body() req: LogUserReq,
        @Res() res: Response
    ) {
        return this.authService.login(req, res)
    }

    @Post('/password/reset')
    resetPassword(@Body() user: UserPassword) {

        return this.authService.forgot(user);
    }

    @UseGuards(JwtStrategy)
    @Get('/logout')
    logout(@UserObj() user: any, @Res() res: Response) {
        return this.authService.logout(user, res);
    }
}
